import axios from '@/api/axios';
import { recupererDevisesPopulaires } from '@/api/devises';

jest.mock('@/api/axios');

describe('API devises', () => {
  it('fetches popular currencies', async () => {
    const mockResponse = { data: [{ nom: 'USD' }] };
    axios.get.mockResolvedValue(mockResponse);

    const res = await recupererDevisesPopulaires();
    expect(axios.get).toHaveBeenCalledWith('/devises/populaires');
    expect(res).toEqual(mockResponse);
  });
});