from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import sys
from threading import Thread
import time
def getPath(file):
    path = os.path.abspath(file)
    return path
driver = []
wait = []
thread = []
input_data = sys.argv
video_url = getPath(sys.argv[1])
list_account = str(sys.argv[2])
if str(sys.argv[3]) != 'null':
    list_account += "|" + str(sys.argv[3])
if str(sys.argv[4]) != "null":
    list_account += "|" + str(sys.argv[4])
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
            driver[self.count].get("""https://accounts.kakao.com/login?continue=https%3A%2F%2Ftv.kakao.com%2F""")
            wait[self.count].until(EC.presence_of_element_located((By.ID, """id_email_2"""))).send_keys(self.username)
            driver[self.count].find_element_by_id("id_password_3").send_keys(self.password)
            driver[self.count].find_element_by_xpath("""//*[@id="login-form"]/fieldset/div[8]/button[1]""").click()
            flag = True
            while(flag):
                if(driver[self.count].title != "Kakao Account"):
                    flag = False
            driver[self.count].get("https://tv.kakao.com/station/uploader")
            wait[self.count].until(EC.presence_of_element_located((By.CLASS_NAME, "inp_attach"))).send_keys(video_url)
            flag = True
            while(flag):
                status = driver[self.count].find_element_by_id("successCnt").text
                if(status == "1"):
                    flag = False
            time.sleep(1)
            driver[self.count].find_element_by_class_name("link_detailinfo").click()
            wait[self.count].until(EC.presence_of_element_located((By.XPATH, """/html/body/div[2]/div[2]/div[1]/div/div[3]/div/div/div[2]/form/fieldset/div[1]/div[2]/div[2]"""))).click()
            driver[self.count].find_element_by_xpath("""/html/body/div[2]/div[2]/div[1]/div/div[3]/div/div/div[2]/form/fieldset/div[1]/div[2]/div[2]/div[3]/ul/li[1]""").click()
            driver[self.count].find_element_by_xpath("""/html/body/div[2]/div[2]/div[1]/div/div[3]/div/div/div[2]/form/fieldset/div[3]/div[11]/button[2]""").click()
            link_url = driver[self.count].find_element_by_class_name("link_url").text
            print(link_url)
            time.sleep(5)
        except Exception as e:
            print(self.username + "|" + "Error")  
        driver[self.count].quit()    
accounts = list_account.split("|")
for i in range(0, len(accounts)):
    thread.append(multithread(accounts[i], i))
    thread[i].start()