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
try:
    driver.get("https://instagram.com")
    time.sleep(1)
    wait.until(EC.presence_of_element_located((By.XPATH, """//input[@name='username']"""))).send_keys(username1) 
    #an8amc1234
    driver.find_element_by_name("password").send_keys(password1)
    #tonyparker2003
    driver.find_element_by_xpath("""/html/body/div[1]/section/main/article/div[2]/div[1]/div/form/div/div[3]/button""").click()
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, """/html/body/div[4]/div/div/div/div[3]/button[2]"""))).click()
    except Exception as e:
        print(e)
    driver.get(url_1)
    video = wait.until(EC.presence_of_element_located((By.TAG_NAME, "video")))
    href = video.get_attribute("src")
    url = href
except Exception as e:
    try:
        driver.quit()
        driver.get("https://instagram.com")
        wait.until(EC.presence_of_element_located((By.XPATH, """//input[@name='username']"""))).send_keys(username2) 
        #an8amc1234
        driver.find_element_by_name("password").send_keys(password2)
        #tonyparker2003
        driver.find_element_by_xpath("""/html/body/div[1]/section/main/article/div[2]/div[1]/div/form/div/div[3]/button""").click()
        try:
            wait.until(EC.presence_of_element_located((By.XPATH, """/html/body/div[4]/div/div/div/div[3]/button[2]"""))).click()
        except:
            pass
        driver.get(url_2)
        video = wait.until(EC.presence_of_element_located((By.TAG_NAME, "video")))
        href = video.get_attribute("src")
        url = href
    except:
        x = 2
        try:
            driver.quit()
            driver.get("https://instagram.com")
            wait.until(EC.presence_of_element_located((By.XPATH, """//input[@name='username']"""))).send_keys(username3) 
            #an8amc1234
            driver.find_element_by_name("password").send_keys(password3)
            #tonyparker2003
            driver.find_element_by_xpath("""/html/body/div[1]/section/main/article/div[2]/div[1]/div/form/div/div[3]/button""").click()
            try:
                wait.until(EC.presence_of_element_located((By.XPATH, """/html/body/div[4]/div/div/div/div[3]/button[2]"""))).click()
            except:
                pass
            driver.get(url_3)
            video = wait.until(EC.presence_of_element_located((By.TAG_NAME, "video")))
            href = video.get_attribute("src")
            url = href
        except:
            x = 3
print(str(url) + "|" + str(x))
driver.quit()