#!/bin/bash

PROJECT_ROOT_DIR=`dirname $0`/..

npx typedoc --plugin typedoc-plugin-markdown "src/**/*.ts"
git add $PROJECT_ROOT_DIR/docs && git commit -m "docs update"