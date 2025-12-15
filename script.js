jQuery(document).ready(function($) {

    // --- HELPER: Format Money ---
    function formatMoney(priceData) {
        const symbol = priceData.currency_symbol || priceData.currency_prefix || '$';
        const decimals = (typeof priceData.currency_minor_unit !== 'undefined') ? priceData.currency_minor_unit : 2;
        
        const priceVal = parseInt(priceData.price) / Math.pow(10, decimals);
        const regVal   = parseInt(priceData.regular_price) / Math.pow(10, decimals);
        
        const priceFormatted = symbol + priceVal.toFixed(decimals);
        const regFormatted   = symbol + regVal.toFixed(decimals);

        if (priceData.price !== priceData.regular_price) {
            return `<del style="color:#999; margin-right:5px; font-size:0.9em;">${regFormatted}</del> <ins style="text-decoration:none;">${priceFormatted}</ins>`;
        }
        return priceFormatted;
    }

    // --- MAIN LOOP ---
    $('.dynamic-woo-slider').each(function() {
        
        const $container = $(this);
        const categoryID = $container.data('category');
        
        if(!categoryID) return;

        const apiURL = '/wp-json/wc/store/v1/products?category=' + categoryID;

        fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            
            if(products.length === 0) {
                $container.html('<p style="font-size:13px; color:#777;">No products found.</p>').css('opacity', '1');
                return;
            }

            products.forEach(product => {
                const img = product.images.length ? product.images[0].src : '';
                const priceHtml = formatMoney(product.prices);

                const html = `
                    <div class="dynamic-slide-item">
                        <div class="slide-img-wrap">
                            <a href="${product.permalink}">
                                <img src="${img}" alt="${product.name}">
                            </a>
                        </div>
                        <div class="slide-content">
                            <h3><a href="${product.permalink}">${product.name}</a></h3>
                            <div class="dynamic-price">${priceHtml}</div>
                        </div>
                        <a href="${product.permalink}" class="dynamic-btn">View</a>
                    </div>
                `;
                $container.append(html);
            });

            // Initialize Owl Carousel
            $container.addClass('owl-carousel owl-theme');
            $container.owlCarousel({
                loop: true,
                margin: 15, /* Tighter gaps */
                nav: false, 
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                responsive: {
                    0: { items: 2 },    // Mobile: Show 2 smaller items (optional)
                    600: { items: 3 },  // Tablet: Show 3 items
                    1000: { items: 5 }  // Desktop: Show 5 items (Makes them smaller)
                }
            });

            $container.css('opacity', '1');
        })
        .catch(error => { console.error('API Error:', error); });
    });
});