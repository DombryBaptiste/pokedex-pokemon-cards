export interface CardPrinting
{
    id: number;
    pokemonCardId: string;
    type: PrintingTypeEnum
}

export enum PrintingTypeEnum {
    Normal,
    Reverse,
    NonHolo,
    HoloCosmo,
    HoloCrackedIce,
    TamponLeague
}
