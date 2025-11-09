import jsPDF from 'jspdf';
import { ConfirmedSale, StoreInfo } from '../contexts/DataContext';
import { formatCurrency, formatDate } from './dateUtils';

export const generatePDFReceipt = (sale: ConfirmedSale, storeInfo: StoreInfo): jsPDF => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(storeInfo.name, 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(storeInfo.address, 105, 30, { align: 'center' });
  doc.text(storeInfo.phone, 105, 37, { align: 'center' });

  doc.line(15, 45, 195, 45);

  doc.setFontSize(10);
  doc.text(`Receipt ID: ${sale.id}`, 15, 55);
  doc.text(`Date: ${formatDate(new Date(sale.saleTime))}`, 15, 60);
  doc.text(`Customer: ${sale.customerNumber || 'N/A'}`, 15, 65);

  doc.line(15, 70, 195, 70);

  let y = 80;
  doc.text('Item', 15, y);
  doc.text('Qty', 120, y);
  doc.text('Price', 150, y);
  doc.text('Total', 180, y);
  y += 5;
  doc.line(15, y, 195, y);
  y += 5;

  sale.items.forEach(item => {
    doc.text(item.name, 15, y);
    doc.text(item.saleQuantity.toString(), 120, y);
    doc.text(formatCurrency(item.price), 150, y);
    doc.text(formatCurrency(item.price * item.saleQuantity), 180, y);
    y += 7;
  });

  doc.line(15, y, 195, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Total: ${formatCurrency(sale.total)}`, 15, y);
  doc.text(`Amount Given: ${formatCurrency(sale.amountGiven)}`, 15, y + 7);
  doc.text(`Change: ${formatCurrency(sale.change)}`, 15, y + 14);

  doc.line(15, y + 20, 195, y + 20);
  y += 27;

  doc.text('Thank you for your purchase!', 105, y, { align: 'center' });

  return doc;
};
