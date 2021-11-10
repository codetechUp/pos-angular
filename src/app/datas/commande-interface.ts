import { ProduitInterface } from './produit-inteface';


export interface CommandeInterface {
  id: number;
  items: ProduitInterface[];
  total?: number;

}
