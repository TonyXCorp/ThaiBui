from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import sys

def getPath(file):
    path = os.path.abspath(file)
    return path
input_data = sys.argv
video_url = getPath(sys.argv[1])
username = sys.argv[2].split(":")[0]
password = sys.argv[2].split(":")[1]
title = sys.argv[3]
description = sys.argv[4]
options = webdriver.ChromeOptions()
options.add_argument('--log-level 3') 
driver = webdriver.Chrome(chrome_options=options)
wait = WebDriverWait(driver, 10)
try:
    driver.get("https://instagram.com")
    wait.until(EC.presence_of_element_located((By.XPATH, """//input[@name='username']"""))).send_keys(username) 
    #an8amc1234
    driver.find_element_by_name("password").send_keys(password)
    #tonyparker2003
    driver.find_element_by_xpath("""/html/body/div[1]/section/main/article/div[2]/div[1]/div/form/div/div[3]/button""").click()
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, """/html/body/div[4]/div/div/div/div[3]/button[2]"""))).click()
    except:
        pass
    driver.get("https://www.instagram.com/tv/upload")
    upload_input = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "YeWti")))
    upload_input.send_keys(video_url)
    while (1 != 2):
        up_percent = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "gCQgN")))
        if (up_percent.text == "100%"): 
            break
    driver.find_element_by_xpath("""/html/body/div[1]/section/main/div/form/div/div[2]/div[4]/div/div/input""").send_keys(title)
    driver.find_element_by_xpath("""//*[@id="react-root"]/section/main/div/form/div/div[2]/div[5]/div/div/textarea""").send_keys(description)
    driver.find_element_by_xpath("""/html/body/div[1]/section/main/div/form/div/div[2]/div[10]/button""").click()
    while (1!=2):
        if(driver.title != "Instagram"):
            break
    flag = True
    while (flag):
        try:
            driver.find_element_by_xpath("""//div[contains(@class, '_bz0w')]""")
        except:
            flag = False
    try:
        first_video = driver.find_element_by_class_name("_bz0w")
        insta_link = first_video.get_attribute("href")
        print(insta_link)
    except:
        print("Not found")
except:
    print("Error")
# driver.quit()