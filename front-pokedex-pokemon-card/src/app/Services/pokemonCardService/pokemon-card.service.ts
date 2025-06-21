import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { PokemonCard, PokemonCardTypeSelected } from '../../Models/pokemonCard';
import { OwnedPokemonCard, OwnedWantedPokemonCard } from '../../Models/OwnedChasePokemonCard';
import { PokemonUtilsService } from '../pokemonUtilsService/pokemon-utils.service';

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

  setOwnedCard(pokemonCard: PokemonCard, pokedexId: number)
  {
    const dto = {
      cardId: pokemonCard.id,
      pokemonId: pokemonCard.pokemonId
    }
    return this.http.post(this.baseUrl + "/" + pokedexId + "/set-owned-card", dto);
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

  delete(pokedexId: number, pokemonId: number, type: PokemonCardTypeSelected) {
    return this.http.delete(this.baseUrl + '/' + pokedexId + '/' + pokemonId,
      { params: new HttpParams().set('type', type)}
    )
  }

  updateOwned(cardId: number, card: OwnedPokemonCard)
  {
    return this.http.put(this.baseUrl + '/owned-card/' + cardId, card);
  }
}
