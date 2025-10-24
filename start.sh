#!/bin/bash
npm start &
exec php -S 0.0.0.0:$PORT -t app
