#!/bin/sh
browserify ../dist/*.js --standalone WebEngine > bundle.js --ignore lapack
echo "browserify successful..."
