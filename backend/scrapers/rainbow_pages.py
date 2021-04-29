import requests
import os
import pandas
from bs4 import BeautifulSoup
from datetime import datetime


def get_images(image_url, images, product_name):
    if requests.get(image_url):
        time = datetime.now().strftime("%H_%M_%S")
        pname = product_name.replace(" ", "").replace("/","")
        path = f"scraped_images/dsi_images/{pname}"
        if not os.path.exists(path):
            os.makedirs(path)

        base_image_name = f'{pname}_0_{time}.png'
        with open(os.path.join(path, base_image_name), 'wb') as file:
            image = requests.get(image_url)
            file.write(image.content)

        i = 1
        for img in images:
            image_name = f'{pname}_{i}_{time}.png'
            with open(os.path.join(path, image_name), 'wb') as file:
                image = requests.get(img)
                file.write(image.content)
                i = i+1
    else:
        print('Malformed images provided! not scraped!')


def scrape(url, categories, cap_image = True):
    all_products_df = []
    for c in categories:
        mcat = c.get('main')
        if cap_image:
            print(f"main category scraping now: {mcat}")
        else:
            print(f"New dataset preparing for category: {mcat} ... Please wait...")
        for cat in c.get('sub'):
            if cap_image:
                print(f"sub category scraping now: {cat}")
            else:
                print(f"New dataset preparing for sub category: {cat} ... Please wait...")
            r1 = requests.get(f'{url}/{mcat}/{cat}/')
            selected = BeautifulSoup(r1.content, 'html.parser').find_all('a', attrs={'class': 'page-numbers'})
            if len(selected) > 2:
                no_of_pages = int(selected[(len(selected) - 2)].string)
            else:
                no_of_pages = 1
            if cap_image:
                print(f"No of pages to scrape in category {cat}: {no_of_pages}", )

            for i in range(no_of_pages):
                try:
                    if cap_image:
                        print(f"page scraping: {i+1}")
                    r2 = requests.get(f'{url}/{mcat}/{cat}/page/{i+1}/')
                    products = BeautifulSoup(r2.content, 'html.parser').select('.woocommerce-LoopProduct-link')
                    for prod in products:
                        product_image = prod.div.img.get('src').replace('//', 'https://')
                        product_title = prod.h2.string

                        # Navigating product page to get product details
                        r_details = requests.get(prod.get('href'))
                        soup_product_details = BeautifulSoup(r_details.content, 'html.parser')

                        product_image_items = soup_product_details.select('.woocommerce-product-gallery__wrapper > div')
                        product_images = []
                        for imgs in product_image_items:
                            product_images.append(imgs.get('data-thumb'))

                        product_price = soup_product_details.find('span', attrs={'class':'woocommerce-Price-amount amount'})
                        if product_price is not None:
                            actual_price = float(product_price.text.replace('Rs','').replace(' ', '').replace(',', ''))
                        else:
                            actual_price = 0.0

                        product_brand_items = soup_product_details.find_all('span', attrs={'class': 'posted_in'})
                        product_brand = ''
                        for brand in product_brand_items:
                            if brand is not None:
                                if 'Brand:' in brand.text:
                                    product_brand = brand.a.text

                        product_sku = soup_product_details.find('span', attrs={'class': 'sku'}).text
                        if product_sku is None:
                            product_sku = ''

                        product_size_items = soup_product_details.find_all('input', attrs={'type':'radio'})
                        product_sizes = []
                        for size in product_size_items:
                            product_sizes.append(size.get('value'))

                        product = {
                            'Product ID': product_sku,
                            'Product Title': product_title,
                            'Product Image': product_image,
                            'Product Images': product_images,
                            'Price: Sale Price': actual_price,
                            'Price: Regular Price': actual_price,
                            'Brand': product_brand,
                            'Inventory': 'In Stock',
                            'Tax: Tax Status': 'Taxable',
                            'Product Variations: Size': product_sizes,
                            'Product Description': '',
                            'Product Short Description': '',
                            'Product SKU': product_sku,
                            'Product Categories': f'{mcat}:{cat}',
                            'Product Status': 'active',
                            'Visibility': 'Visible',
                            'Product Tags': '',
                            'Post Author': 'Badumalla',
                                   }
                        all_products_df.append(product)
                        if cap_image:
                            # print(product)
                            # saving image
                            get_images(product_image,product_images, product_title)
                    if cap_image:
                        print(f'all products scraped in page {i+1}')
                except Exception as e:
                    print(f"Error occurred: {e}")
            if cap_image:
                print(f'all products scraped for sub category {cat}')
        if cap_image:
            print(f'all products scraped for category {mcat}')
    if cap_image:
        print('all products scraped!')
    else:
        print('new dataset prepared for comparison.')
    return all_products_df

def main():
    base_url = "https://www.dsifootcandy.lk"

    categories = [
        {
            'main': 'men',
            'sub': ['men-industrial',  ]
        },
    ]

    print("Scraping dsi footkandy....")
    all_products_df = scrape(base_url, categories)

    products_df = pandas.DataFrame(all_products_df)
    path = "scraped_data/dsi_data"
    if not os.path.exists(path):
        os.makedirs(path)
    products_df.to_csv(f'{path}/dsi_products_details.csv', mode='a', index=False)
    print("dsi footkandy scraping completed")


if __name__ == "__main__":
    main()
