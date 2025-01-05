use notify::{recommended_watcher, Event, RecursiveMode, Watcher};
use std::{ path::Path, sync::mpsc, thread};

pub(crate) struct FileChangeWatcher {
    watcher: Option<notify::RecommendedWatcher>,
    stop_tx: Option<mpsc::Sender<()>>,
}

impl FileChangeWatcher {
    pub(crate) fn new() -> Self {
        FileChangeWatcher {
            watcher: None,
            stop_tx: None,
        }
    }

    pub(crate) fn spawn(
        &mut self,
        target_file_path: String,
        handle_on_change: impl Fn() + Send + 'static,
    ) -> Result<(), FileChangeWatcherError> {
        let (tx, rx) = mpsc::channel::<notify::Result<Event>>();
        let (stop_tx, stop_rx) = mpsc::channel::<()>();
        let mut watcher = recommended_watcher(tx).unwrap();

        watcher.watch(Path::new(&target_file_path), RecursiveMode::NonRecursive)?;

        thread::spawn(move || {
            loop {
                // 終了通知が来たらスレッドを終了
                if stop_rx.try_recv().is_ok() {
                    break;
                }

                if let Ok(res) = rx.recv() {
                    let Ok(event) = res else {
                        continue;
                    };

                    match event.kind {
                        notify::EventKind::Access(_) => continue,
                        notify::EventKind::Other => continue,
                        notify::EventKind::Any => continue,
                        _ => {}
                    }

                    handle_on_change();
                }
            }
        });

        self.watcher = Some(watcher);
        self.stop_tx = Some(stop_tx); // 終了通知用Senderを保持
                                      //
        Ok(())
    }

    pub(crate) fn despawn(&mut self) -> Result<(), FileChangeWatcherError> {
        let Some(stop_tx) = self.stop_tx.take() else {
            return Err(FileChangeWatcherError::WatcherNotSpawned);
        };
        let Some(_) = self.watcher.take() else {
            return Err(FileChangeWatcherError::WatcherNotSpawned);
        };

        stop_tx.send(())?;

        self.watcher = None;
        self.stop_tx = None;
        Ok(())
    }
}

#[derive(Debug)]
pub(crate) enum FileChangeWatcherError {
    WatcherNotSpawned,
    SendError,
    NotifyError,
}

impl From<mpsc::SendError<()>> for FileChangeWatcherError {
    fn from(_: mpsc::SendError<()>) -> Self {
        FileChangeWatcherError::SendError
    }
}
impl From<notify::Error> for FileChangeWatcherError {
    fn from(_: notify::Error) -> Self {
        FileChangeWatcherError::NotifyError
    }
    
}
