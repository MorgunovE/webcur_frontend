import axios from '@/api/axios';
import * as devisesApi from '@/api/devises';
import {recupererDevisesFavoris} from "@/api/devises";

jest.mock('@/api/axios');

describe('devises API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('recupererDevisesPopulaires pour lister les devises populaires', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await devisesApi.recupererDevisesPopulaires();
    expect(axios.get).toHaveBeenCalledWith('/devises/populaires');
  });

  it('recupererDevise pour récupérer une devise spécifique', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await devisesApi.recupererDevise('EUR');
    expect(axios.get).toHaveBeenCalledWith('/devises/EUR');
  });

  it('recupererHistoriqueDevise pour récupérer l\'historique d\'une devise', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await devisesApi.recupererHistoriqueDevise('USD', 10);
    expect(axios.get).toHaveBeenCalledWith('/devises/USD/historique?jours=10');
  });

  it('recupererDevisesFavoris pour récupérer les devises favorites', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await devisesApi.recupererDevisesFavoris();
    expect(axios.get).toHaveBeenCalledWith('/devises/favoris');
  });

  it('convertirDevise pour convertir une devise', async () => {
    const payload = { code_source: 'USD', code_cible: 'EUR', montant: 100 };
    axios.post.mockResolvedValue({ data: {} });
    await devisesApi.convertirDevise(payload);
    expect(axios.post).toHaveBeenCalledWith('/devises/conversion', payload);
  });

  it('ajouterDeviseFavori pour ajouter une devise favorite', async () => {
    axios.post.mockResolvedValue({ data: {} });
    await devisesApi.ajouterDeviseFavori('EUR');
    expect(axios.post).toHaveBeenCalledWith('/devises/favoris', { nom_devise: 'EUR' });
  });

  it('supprimerDeviseFavori pour supprimer une devise favorite', async () => {
    axios.delete.mockResolvedValue({ data: {} });
    await devisesApi.supprimerDeviseFavori('USD');
    expect(axios.delete).toHaveBeenCalledWith('/devises/favoris', { data: { nom_devise: 'USD' } });
  });

});