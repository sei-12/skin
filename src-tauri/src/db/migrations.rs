/// https://github.com/tauri-apps/tauri-plugin-sql/blob/99af9d81fa344181f86dfb1ed1e17c1ac8e6ec23/src/lib.rs
use futures::future::BoxFuture;
use sqlx::{
    error::BoxDynError,
    migrate::{Migration as SqlxMigration, MigrationSource, MigrationType, Migrator},
};

pub(super) async fn migrator() -> Result<Migrator, sqlx::Error> {
    let mig = Migrator::new(migrations()).await?;
    Ok(mig)
}

fn migrations() -> MigrationList {
    MigrationList(vec![Migration {
        version: 1,
        description: "create initial tables",
        sql: "
            create table if not exists bookmarks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title text not null,
                url text not null,
                description text not null,
                tag_count int not null
            );

            create table if not exists tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text unique
            );

            create table if not exists tag_map (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bkmk_id int not null,
                tag_id int not null,
                FOREIGN KEY (bkmk_id) REFERENCES bookmarks (id),
                FOREIGN KEY (tag_id) REFERENCES tags (id),
                UNIQUE (bkmk_id,tag_id)
            );
            ",
        kind: MigrationKind::Up,
    }])
}

#[derive(Debug)]
enum MigrationKind {
    Up,
    // Down,
}

impl From<MigrationKind> for MigrationType {
    fn from(kind: MigrationKind) -> Self {
        match kind {
            MigrationKind::Up => Self::ReversibleUp,
            // MigrationKind::Down => Self::ReversibleDown,
        }
    }
}

#[derive(Debug)]
struct Migration {
    pub version: i64,
    pub description: &'static str,
    pub sql: &'static str,
    pub kind: MigrationKind,
}

#[derive(Debug)]
struct MigrationList(Vec<Migration>);

impl MigrationSource<'static> for MigrationList {
    fn resolve(self) -> BoxFuture<'static, std::result::Result<Vec<SqlxMigration>, BoxDynError>> {
        Box::pin(async move {
            let mut migrations = Vec::new();
            for migration in self.0 {
                if matches!(migration.kind, MigrationKind::Up) {
                    migrations.push(SqlxMigration::new(
                        migration.version,
                        migration.description.into(),
                        migration.kind.into(),
                        migration.sql.into(),
                        false,
                    ));
                }
            }
            Ok(migrations)
        })
    }
}
