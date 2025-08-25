import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonUtilsService {

  constructor() { }

  public getFullImageUrl(relativePath: string): string {
    return environment.storageCardImage + relativePath;
  }

  public formatPokedexId(id: number): string {
    return '#' + id.toString().padStart(3, '0');
  }

  public getCardMarketUrl(pokemonName: string, setCode: string, cardNumber: number | string)
  {
    const num = this.formatCardNumber(cardNumber);
    const name = pokemonName.split(' ')[0].replace("Méga-", "M ");

    const query = `${name} (${setCode} ${num})`;
    const encoded = encodeURIComponent(query);
    return `https://www.cardmarket.com/fr/Pokemon/Products/Search?searchString=${encoded}`;
  }

  private formatCardNumber(n: number | string): string {
  if (typeof n === 'number') return n.toString().padStart(3, '0');

  // "123" -> "123" (puis pad)
  if (/^\d+$/.test(n)) return n.padStart(3, '0');

  // "12a" -> "012a"
  const mixed = n.match(/^(\d+)([A-Za-z]+)$/);
  if (mixed) return mixed[1].padStart(3, '0') + mixed[2];

  // "TG01", "RC17", "SV-P 026" -> inchangé
  return n;
}
}
