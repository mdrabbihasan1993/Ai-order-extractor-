
export interface OrderDetails {
  customerName: string | null;
  phoneNumber: string | null;
  deliveryAddress: string | null;
  totalPrice: number | null;
  items?: string | null;
  note?: string | null;
}

export interface OrderRecord extends OrderDetails {
  id: string;
  timestamp: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

export enum ExtractionStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
