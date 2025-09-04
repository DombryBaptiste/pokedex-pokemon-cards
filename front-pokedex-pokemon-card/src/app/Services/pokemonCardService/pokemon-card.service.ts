import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { PokemonCard, PokemonCardTypeSelected } from '../../Models/pokemonCard';
import { OwnedPokemonCard, OwnedWantedPokemonCard } from '../../Models/OwnedChasePokemonCard';
import { PokemonUtilsService } from '../pokemonUtilsService/pokemon-utils.service';
import { PrintingTypeEnum } from '../../Models/cardPrinting';

@Injectable({
  providedIn: 'root'
})
export class PokemonCardService {

  private baseUrl = environment.apiUrl + '/PokemonCard'

  constructor(private http: HttpClient, private pokemonUtilsService: PokemonUtilsService) { }

  getAllByPokemonId(pokemonId: number): Observable<PokemonCard[]>
  {
    return this.http.get<PokemonCard[]>(this.baseUrl + "/" + pokemonId);
  }

  setWantedCard(pokemonCard: PokemonCard, pokedexId: number)
  {
    const dto = {
      cardId: pokemonCard.id,
      pokemonId: pokemonCard.pokemonId
    }
    return this.http.post(this.baseUrl + "/" + pokedexId + "/set-wanted-card", dto);
  }

  setOwnedCard(pokemonCard: PokemonCard, pokedexId: number, type: PrintingTypeEnum | null = null): Observable<OwnedPokemonCard>
  {
    const dto = {
      cardId: pokemonCard.id,
      pokemonId: pokemonCard.pokemonId,
      type: type
    }
    return this.http.post<OwnedPokemonCard>(this.baseUrl + "/" + pokedexId + "/set-owned-card", dto);
  }

  getCardsByPokedexAndPokemonId(pokedexId: number, pokemonId: number): Observable<OwnedWantedPokemonCard>
  {
    return this.http.get<OwnedWantedPokemonCard>(this.baseUrl + '/' + pokedexId + '/pokemon/' + pokemonId).pipe(
      map(cards => {
        let ow = cards.ownedPokemonCard;
        let w = cards.wantedPokemonCard;
        if(ow != null)
        {
          ow.pokemonCard.image = this.pokemonUtilsService.getFullImageUrl(ow.pokemonCard.image);
        }
        if(w != null)
        {
          w.pokemonCard.image = this.pokemonUtilsService.getFullImageUrl(w.pokemonCard.image);
        }
        return cards;
      })
    );
  }

  getCardsWantedButNotOwned(pokedexId: number): Observable<PokemonCard[]> {
    return this.http.get<PokemonCard[]>(this.baseUrl + '/wanted-but-no-owned-cards/' + pokedexId).pipe(
      map((cards: PokemonCard[]) => {
        return cards.map(card => ({
          ...card,
          image: this.pokemonUtilsService.getFullImageUrl(card.image)
        }));
      })
    );
  }


  delete(pokedexId: number, pokemonId: string, type: PokemonCardTypeSelected, printingType: PrintingTypeEnum | null = null ) {
    let params = new HttpParams()
      .set('type', type)
    if(printingType != null)
    {
      params = params.set('printingType', printingType);
    }
      
    return this.http.delete(`${this.baseUrl}/${pokedexId}/${pokemonId}`, { params });
  }

  updateOwned(cardId: number, card: any)
  {
    return this.http.put(this.baseUrl + '/owned-card/' + cardId, card);
  }

  getAllOwned(pokedexId: number): Observable<OwnedPokemonCard[]>
  {
    return this.http.get<OwnedPokemonCard[]>(this.baseUrl + '/owned/' + pokedexId);
  }

  setTypeCard(cardId: string, type: PrintingTypeEnum, isDelete: boolean)
  {
    var data = {type: type, isDelete: isDelete};
    return this.http.post(this.baseUrl + `/${cardId}/type-card`, data);
  }
}
