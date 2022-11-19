import { CurrencyDto } from "../currency/Currency.dto";

export interface AccountDto {
  id: number;
  name: string;
  description: string;
  balance: number;
  currency: CurrencyDto;
}
