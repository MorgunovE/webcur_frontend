import axios from '@/api/axios';
import * as devisesApi from '@/api/devises';
import {recupererDevisesFavoris} from "@/api/devises";

jest.mock('@/api/axios');

describe('devises API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('recupererDevisesPopulaires calls axios.get with /devises/populaires', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await devisesApi.recupererDevisesPopulaires();
    expect(axios.get).toHaveBeenCalledWith('/devises/populaires');
  });

  it('recupererDevise calls axios.get with /devises/:nom', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await devisesApi.recupererDevise('EUR');
    expect(axios.get).toHaveBeenCalledWith('/devises/EUR');
  });

  it('recupererHistoriqueDevise calls axios.get with /devises/:nom/historique', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await devisesApi.recupererHistoriqueDevise('USD', 10);
    expect(axios.get).toHaveBeenCalledWith('/devises/USD/historique?jours=10');
  });

  it('recupererDevisesFavoris calls axios.get with /devises/favoris', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await devisesApi.recupererDevisesFavoris();
    expect(axios.get).toHaveBeenCalledWith('/devises/favoris');
  });

  it('convertirDevise calls axios.post with /devises/conversion and payload', async () => {
    const payload = { code_source: 'USD', code_cible: 'EUR', montant: 100 };
    axios.post.mockResolvedValue({ data: {} });
    await devisesApi.convertirDevise(payload);
    expect(axios.post).toHaveBeenCalledWith('/devises/conversion', payload);
  });

  it('ajouterDeviseFavori calls axios.post with /devises/favoris and payload', async () => {
    axios.post.mockResolvedValue({ data: {} });
    await devisesApi.ajouterDeviseFavori('EUR');
    expect(axios.post).toHaveBeenCalledWith('/devises/favoris', { nom_devise: 'EUR' });
  });

  it('supprimerDeviseFavori calls axios.delete with /devises/favoris and data', async () => {
    axios.delete.mockResolvedValue({ data: {} });
    await devisesApi.supprimerDeviseFavori('USD');
    expect(axios.delete).toHaveBeenCalledWith('/devises/favoris', { data: { nom_devise: 'USD' } });
  });

});