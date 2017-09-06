#!/bin/bash
mongo engage --eval "db.leaders.remove({ 'email' : '$1' })"