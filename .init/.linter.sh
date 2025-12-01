#!/bin/bash
cd /home/kavia/workspace/code-generation/global-investment-insights-213682-213701/investment_web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

