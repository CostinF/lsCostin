import {amazon} from "../utils/amazonItems/amazon";

it(`Should compare the listed product's price and name with price and name from detail product.`, () => {

    amazon.loadAndSplitCSV()

    cy.get('@array').then((itemsArray) => {

        itemsArray.map((item) => {
            amazon.goToPageAndSearchItem(item)

            cy.get('.a-price').then(($prices) => {

                    if ($prices.length === 0) {
                        return
                    }

                    const $searchPrice = $prices.eq(5)
                    let listPrice = $searchPrice.find('.a-offscreen').text()

                    if ($searchPrice.closest('.puisg-row').parent().find('.a-price').length > 1) {
                        listPrice = $searchPrice.closest('.puisg-row').parent().find('.a-price').eq(0).find('.a-offscreen').text()
                    }

                    if ($searchPrice.closest('.s-price-instructions-style').parent().find('.a-price').length > 1) {
                        listPrice = $searchPrice.closest('.s-price-instructions-style').parent().find('.a-price').eq(0).find('.a-offscreen').text()
                    }

                    let $link = $searchPrice.closest('.puisg-row').parent().find('h2 > a')

                    if ($link.length === 0) {
                        $link = $searchPrice.closest('.s-price-instructions-style').parent().find('h2 > a')
                    }

                    const listTitle = $link.find('span').text()

                    cy.get($link).click()

                    cy.get('#centerCol').then(($product) => {
                        const detailsTitle = $product.find('#productTitle').text()

                        expect(listTitle.trim()).to.deep.eq(detailsTitle.trim())

                        let detailsPrice = $product.find('#apex_desktop .apexPriceToPay .a-offscreen').eq(0).text()

                        if ($product.find('#apex_desktop .a-price-range').length !== 0) {
                            const minPrice = +$product.find('#apex_desktop .apexPriceToPay .a-offscreen').eq(0).text().replace('$', '')
                            const maxPrice = +$product.find('#apex_desktop .apexPriceToPay .a-offscreen').eq(1).text().replace('$', '')

                            expect(+listPrice.trim().replace('$', '')).to.be.within(minPrice, maxPrice)

                            return
                        }

                        if (!detailsPrice) {
                            const $priceParent = $product.find('#apex_desktop .priceToPay').eq(0)

                            detailsPrice = $priceParent.find('.a-price-symbol').text()
                                + $priceParent.find('.a-price-whole').text()
                                + $priceParent.find('.a-price-fraction').text()
                        }

                        expect(listPrice.trim()).to.deep.eq(detailsPrice.trim())
                    })
                }
            )
        })
    })
})