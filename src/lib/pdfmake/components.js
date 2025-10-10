import fs from 'fs';

/** @returns {import('pdfmake/interfaces').TDocumentDefinitions['header']} header*/
const BasicHeader = () => {
  const logoSade = fs.readFileSync('src/assets/images/logo-sade.png', 'base64');

  return {
    margin: 24,
    table: {
      widths: ['15%', '85%'],
      body: [
        [
          {
            image: `data:image/png;base64,${logoSade}`,
            borderColor: ['', '', '', '#e2e5e9'],
            border: [false, false, false, true],
            width: 60,
            marginBottom: 16,
            alignment: 'center',
          },
          {
            borderColor: ['', '', '', '#e2e5e9'],
            border: [false, false, false, true],
            marginBottom: 8,
            stack: [
              {
                width: 'auto',
                marginBottom: 4,
                text: 'Sekolah Alam Depok',
                fontSize: 18,
                bold: true,
              },
              {
                text: 'Jl. Bungsan 80 Ds Bedahan, Tugu Sawangan\t\tTelp.: 081905252073/081906058412',
                fontSize: 10,
                marginBottom: 4,
                color: '#666',
              },
              {
                text: 'https:// www.sekolahalamdepok.sch.id\t\tEmail: admin@sekolahalamdepok.sch.id',
                fontSize: 10,
                color: '#666',
              },
            ],
          },
        ],
      ],
    },
  };
};

/** @returns {import('pdfmake/interfaces').TDocumentDefinitions['footer']}*/
const BasicFooter = () => {
  return (page) => ({
    layout: 'noBorders',
    margin: 24,
    table: {
      widths: ['85%', '15%'],
      body: [
        [
          {},
          {
            text: `${page}`,
            fontSize: 10,
            color: '#666',
            alignment: 'right',
          },
        ],
      ],
    },
  });
};

export { BasicHeader, BasicFooter };
