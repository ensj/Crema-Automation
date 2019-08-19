cd "`dirname "$0"`"
npm test
open -a "Google Chrome" mochawesome-report/mochawesome.html