import sys
from better_profanity import profanity
  
# text to be censored
# text = "What the fuck are you doing?"
text = sys.argv[1]
# do censoring
censored = profanity.censor(text)
  
# view output
# print(censored)
if '*' in censored:
    print(1)
else:
    print(0)
##    print(sys.argv[1])
