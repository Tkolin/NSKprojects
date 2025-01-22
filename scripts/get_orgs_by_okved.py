import requests
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, Column, String, Integer, Text, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Настройки базы данных
DB_URL = "mysql+pymysql://root:root@localhost:3306/sibnipi"
engine = create_engine(DB_URL)
Base = declarative_base()
Session = sessionmaker(bind=engine)

# Модель для таблицы organizations
class Organization(Base):
    __tablename__ = 'organizations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    INN = Column(String(255), nullable=True)
    OGRN = Column(String(255), nullable=True)
    KPP = Column(String(255), nullable=True)
    address_legal = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

# Функция для парсинга страницы
def parse_page(okved_code, page_number):
    url = f"https://check.tochka.com/okved/{okved_code}/?page={page_number}"
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    companies = []

    for card in soup.find_all('div', class_='company-card_companyCard__tVhhI'):
        try:
            name = card.find('a', class_='company-card_title__ZyRj8').text.strip()
            inn = card.find(text="ИНН").find_next('span').text.strip()
            ogrn = card.find(text="ОГРН").find_next('span').text.strip()
            kpp = card.find(text="КПП").find_next('span').text.strip()
            address = card.find(text="Юр. адрес").find_next('span').text.strip()

            companies.append({
                'name': name,
                'INN': inn,
                'OGRN': ogrn,
                'KPP': kpp,
                'address_legal': address
            })
        except AttributeError:
            continue

    return companies

# Функция для сохранения данных в базу данных
def save_to_database(session, companies):
    for company in companies:
        try:
            org = Organization(
                name=company['name'],
                INN=company['INN'],
                OGRN=company['OGRN'],
                KPP=company['KPP'],
                address_legal=company['address_legal']
            )
            session.add(org)
        except Exception as e:
            print(f"Ошибка сохранения записи: {e}")
    session.commit()

# Основной скрипт
def main():
    okved_code = input("Введите код ОКВЭД: ").strip()
    max_pages = int(input("Введите количество страниц для парсинга: ").strip())

    Base.metadata.create_all(engine)
    session = Session()

    try:
        for page_number in range(1, max_pages + 1):
            print(f"Парсинг страницы {page_number}...")
            companies = parse_page(okved_code, page_number)
            save_to_database(session, companies)
            print(f"Сохранено {len(companies)} компаний с страницы {page_number}.")
    finally:
        session.close()
        print("Сессия базы данных закрыта.")

if __name__ == "__main__":
    main()
