import React from 'react';

interface SEOProps {
     title?: string;
     description?: string;
     keywords?: string;
     image?: string;
     url?: string;
}

const SEO: React.FC<SEOProps> = ({
     title = 'Geylani Rufai - İlim, İrfan ve Hizmet Yolu',
     description = 'Tasavvuf geleneğini yaşatmak, gönülleri ilahi aşkla buluşturmak ve gelecek nesillere bu manevi mirası aktarmak amacıyla hizmet ediyoruz.',
     keywords = 'geylani, rufai, tasavvuf, dernek, islami ilimler, maneviyat, zikir, sohbet',
     image = '/logo.png',
     url = 'https://geylanirufai.org'
}) => {
     return (
          <>
               {/* React 19 native head element support */}
               <title>{title}</title>
               <meta name="description" content={description} />
               <meta name="keywords" content={keywords} />
               <link rel="canonical" href={url} />

               {/* Open Graph / Facebook */}
               <meta property="og:type" content="website" />
               <meta property="og:url" content={url} />
               <meta property="og:title" content={title} />
               <meta property="og:description" content={description} />
               <meta property="og:image" content={image} />

               {/* Twitter */}
               <meta property="twitter:card" content="summary_large_image" />
               <meta property="twitter:url" content={url} />
               <meta property="twitter:title" content={title} />
               <meta property="twitter:description" content={description} />
               <meta property="twitter:image" content={image} />
          </>
     );
};

export default SEO;
