from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import sys
from threading import Thread
def getPath(file):
    path = os.path.abspath(file)
    return path
driver = []
wait = []
thread = []
input_data = sys.argv
video_url = getPath(sys.argv[1])
list_account = "faltadudre:W3Giklga|vopsiparza:NkMkfW8b|pognulirda:vyze0gWT"
title = sys.argv[3]
description = sys.argv[4]
options = webdriver.ChromeOptions()
options.add_argument('--log-level 3') 
class multithread(Thread):
    def __init__(self, account, count):
        Thread.__init__(self)
        self.username = account.split(':')[0]
        self.password = account.split(':')[1]
        self.count = count
        driver.append(webdriver.Chrome(chrome_options=options))
        wait.append(WebDriverWait(driver[self.count], 10))
    def run(self):
        try:
            driver[self.count].get("https://instagram.com")
            wait[self.count].until(EC.presence_of_element_located((By.XPATH, """//input[@name='username']"""))).send_keys(self.username) 
            #an8amc1234
            driver[self.count].find_element_by_name("password").send_keys(self.password)
            #tonyparker2003
            driver[self.count].find_element_by_xpath("""/html/body/div[1]/section/main/article/div[2]/div[1]/div/form/div/div[3]/button""").click()
            try:
                wait[self.count].until(EC.presence_of_element_located((By.XPATH, """/html/body/div[4]/div/div/div/div[3]/button[2]"""))).click()
            except:
                pass
            driver[self.count].get("https://www.instagram.com/tv/upload")
            upload_input = wait[self.count].until(EC.presence_of_element_located((By.CLASS_NAME, "YeWti")))
            upload_input.send_keys(video_url)
            while (1 != 2):
                up_percent = wait[self.count].until(EC.presence_of_element_located((By.CLASS_NAME, "gCQgN")))
                if (up_percent.text == "100%"): 
                    break
            driver[self.count].find_element_by_xpath("""/html/body/div[1]/section/main/div/form/div/div[2]/div[4]/div/div/input""").send_keys(title)
            driver[self.count].find_element_by_xpath("""//*[@id="react-root"]/section/main/div/form/div/div[2]/div[5]/div/div/textarea""").send_keys(description)
            driver[self.count].find_element_by_xpath("""/html/body/div[1]/section/main/div/form/div/div[2]/div[10]/button""").click()
            while (1!=2):
                if(driver[self.count].title != "Instagram"):
                    break
            flag = True
            while (flag):
                try:
                    driver[self.count].find_element_by_xpath("""//div[@class='fj4kY CABe1']""")
                except Exception as e:
                    flag = False
            try:
                first_video = driver[self.count].find_element_by_class_name("_bz0w")
                insta_link = first_video.get_attribute("href")
                print(self.username + "|" + insta_link)
            except:
                print(self.username + "|" + "Error")
        except:
            print(self.username + "|" + "Error")      
        # driver[self.count].quit()
accounts = list_account.split("|")
# for i in range(0, 3):
#     thread.append(multithread(accounts[i], i))
#     thread[i].start()
thread.append(multithread(accounts[1], 0))
thread[0].start()