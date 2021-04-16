import pickle

with open('text.txt', 'rb') as cookiesfile:
        cookies = pickle.load(cookiesfile)
        print(cookies)