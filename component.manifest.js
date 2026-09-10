module.exports = {
  vendorName: 'Directum',
  componentName: 'ReactExample',
  componentVersion: '1.0',
  controls: [
    {
      name: 'TenderTableControl',
      loaders: [
        {
          name: 'tender-table-loader',
          scope: 'Card'
        }
      ],
      displayNames: [
        { locale: 'en', name: 'Tender committee protocol table' },
        { locale: 'ru', name: 'Таблица протокола тендерного комитета' },
      ]
    }
  ]
};
