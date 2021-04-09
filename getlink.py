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
video_url = sys.argv[1]
username = sys.argv[2].split(":")[0]
password = sys.argv[2].split(":")[1]
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
    driver.get(video_url)
    video = wait.until(EC.presence_of_element_located((By.TAG_NAME, "video")))
    href = video.get_attribute("src")
    print(href)
except:
    print("Error")
driver.quit()