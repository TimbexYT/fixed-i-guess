#!/bin/bash
echo "Starting Vehicle Sensor Simulator..."
cd /home/runner/workspace
exec npx tsx scripts/simulate.ts
