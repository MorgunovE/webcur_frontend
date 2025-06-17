jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    internal: { pageSize: { getWidth: () => 595, getHeight: () => 842 } }
  }));
});
jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
  toDataURL: () => 'data:image/png;base64,MOCK',
  width: 100,
  height: 100
})));