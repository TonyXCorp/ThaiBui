from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import sys
import time

def getPath(file):
    path = os.path.abspath(file)
    return path
input_data = sys.argv
username1 = sys.argv[1].split("|")[0]
password1 = sys.argv[1].split("|")[1]
url_1 = sys.argv[1].split("|")[2]

username2 = sys.argv[2].split("|")[0]
password2 = sys.argv[2].split("|")[1]
url_2 = sys.argv[2].split("|")[2]

username3 = sys.argv[3].split("|")[0]
password3 = sys.argv[3].split("|")[1]
url_3 = sys.argv[3].split("|")[2]
options = webdriver.ChromeOptions()
options.add_argument('--log-level 3') 
driver = webdriver.Chrome(chrome_options=options)
wait = WebDriverWait(driver, 10)
x = 0
account = username1
try:
    driver.get("""https://accounts.kakao.com/login?continue=https%3A%2F%2Ftv.kakao.com%2F""")
    wait.until(EC.presence_of_element_located((By.ID, """id_email_2"""))).send_keys(username)
    driver.find_element_by_id("id_password_3").send_keys(password)
    driver.find_element_by_xpath("""//*[@id="login-form"]/fieldset/div[8]/button[1]""").click()
    flag = True
    while(flag):
        if(driver.title != "Kakao Account"):
            flag = False
    driver.get("https://tv.kakao.com/katz/v1/ft/cliplink/"+ str(video_url) + "/readyNplay?player=monet_html5&referer=&pageReferer=&profile=MAIN")
    time.sleep(1)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    data = json.loads(soup.get_text())
    url = data["videoLocation"]["url"]
except Exception as e:
    x=1
    account = username1
    try:
        driver.quit()
        driver.get("""https://accounts.kakao.com/login?continue=https%3A%2F%2Ftv.kakao.com%2F""")
        wait.until(EC.presence_of_element_located((By.ID, """id_email_2"""))).send_keys(username)
        driver.find_element_by_id("id_password_3").send_keys(password)
        driver.find_element_by_xpath("""//*[@id="login-form"]/fieldset/div[8]/button[1]""").click()
        flag = True
        while(flag):
            if(driver.title != "Kakao Account"):
                flag = False
        driver.get("https://tv.kakao.com/katz/v1/ft/cliplink/"+ str(video_url) + "/readyNplay?player=monet_html5&referer=&pageReferer=&profile=MAIN")
        time.sleep(1)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        data = json.loads(soup.get_text())
        url = data["videoLocation"]["url"]
    except:
        x = 2
        account = username3
        try:
            driver.quit()
            driver.get("""https://accounts.kakao.com/login?continue=https%3A%2F%2Ftv.kakao.com%2F""")
            wait.until(EC.presence_of_element_located((By.ID, """id_email_2"""))).send_keys(username)
            driver.find_element_by_id("id_password_3").send_keys(password)
            driver.find_element_by_xpath("""//*[@id="login-form"]/fieldset/div[8]/button[1]""").click()
            flag = True
            while(flag):
                if(driver.title != "Kakao Account"):
                    flag = False
            driver.get("https://tv.kakao.com/katz/v1/ft/cliplink/"+ str(video_url) + "/readyNplay?player=monet_html5&referer=&pageReferer=&profile=MAIN")
            time.sleep(1)
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            data = json.loads(soup.get_text())
            url = data["videoLocation"]["url"]
        except:
            x = 3
print(str(url) + "|" + str(x) + "|" + str(account))
driver.quit()