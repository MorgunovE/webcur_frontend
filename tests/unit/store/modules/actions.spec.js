import actionsModule from '@/store/modules/actions';
import * as api from '@/api/actions';

jest.mock('@/api/actions');

describe('Vuex actions module', () => {
  it('fetches popular actions and commits them', async () => {
    const commit = jest.fn();
    const mockData = [{ symbole: 'AAPL', close: 100 }];
    api.recupererActionsPopulaires.mockResolvedValue({ data: mockData });

    await actionsModule.actions.chargerActionsPopulaires({ commit });

    expect(api.recupererActionsPopulaires).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith('setActionsPopulaires', mockData);
  });
});