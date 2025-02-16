#!/bin/bash

yarn run test && 
yarn run lint && 
npx prettier . --check && 
cd src-tauri && 
cargo test && 
cargo check && 
cargo fmt --all -- --check && 
cargo clippy
