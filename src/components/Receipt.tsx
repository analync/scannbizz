import React from 'react';
import { SaleItem, StoreInfo, ConfirmedSale } from '../contexts/DataContext';
import { formatCurrency, formatDate } from '../utils/dateUtils';

interface ReceiptProps {
  saleDetails: ConfirmedSale;
  storeInfo: StoreInfo;
}

const Receipt: React.FC<ReceiptProps> = ({ saleDetails, storeInfo }) => {
  if (!saleDetails) return null;

  return (
    <div style={{ width: '300px', fontFamily: 'monospace', color: '#000', backgroundColor: '#fff', padding: '15px', border: '1px solid #ddd' }}>
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: '0', fontSize: '1.5em' }}>{storeInfo.name}</h2>
        <p style={{ margin: '0' }}>{storeInfo.address}</p>
        <p style={{ margin: '0' }}>{storeInfo.phone}</p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <p><strong>Receipt No:</strong> {saleDetails.id.slice(-6)}</p>
        <p><strong>Date:</strong> {formatDate(new Date(saleDetails.saleTime))}</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px dashed #000', paddingBottom: '5px' }}>Item</th>
            <th style={{ textAlign: 'right', borderBottom: '1px dashed #000', paddingBottom: '5px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {saleDetails.items.map((item: SaleItem) => (
            <tr key={item.saleId}>
              <td>
                {item.name}<br/>
                <small>{item.saleQuantity} x {formatCurrency(item.price)}</small>
              </td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(item.price * item.saleQuantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #000', paddingTop: '10px' }}>
        <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Total:</strong> <strong>{formatCurrency(saleDetails.total)}</strong></p>
        <p style={{ display: 'flex', justifyContent: 'space-between' }}>Paid: {formatCurrency(saleDetails.amountGiven)}</p>
        <p style={{ display: 'flex', justifyContent: 'space-between' }}>Change: {formatCurrency(saleDetails.change)}</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px dashed #000', paddingTop: '10px' }}>
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
};

export default Receipt;
