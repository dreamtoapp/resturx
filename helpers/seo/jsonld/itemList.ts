export type ItemListEntry = {
  position: number;
  url: string;
  name: string;
  image?: string | null;
};

export function buildItemListJsonLd(items: ItemListEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      url: item.url,
      name: item.name,
      image: item.image || undefined,
    })),
  };
}


