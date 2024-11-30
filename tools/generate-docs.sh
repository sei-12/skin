#!/bin/bash

npx typedoc --plugin typedoc-plugin-markdown "src/**/*.ts"
git add ./docs
git commit