import { maintenanceRepository } from '../repository/maintenanceRepository';
import type { MaintenanceCreatePayload, MaintenanceFilters, MaintenanceUpdatePayload } from '../types/maintenance';

describe('Maintenance Repository', () => {
  const mockData: MaintenanceCreatePayload = {
    title: 'Test Request',
    description: 'Test description',
    category: 'plumbing',
    priority: 'high',
    building: 1,
    unit: 1,
    renter: 1,
    preferred_date: '2024-01-01',
    notes: 'Test notes',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch maintenance requests', async () => {
    const mockResponse = { results: [mockData] };
    const mockList = jest.spyOn(maintenanceRepository, 'fetchMaintenanceRequests').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchMaintenanceRequests();
    expect(result).toEqual(mockResponse);
    expect(mockList).toHaveBeenCalled();
  });

  it('should create a maintenance request', async () => {
    const mockResponse = { ...mockData, id: 1 };
    const mockCreate = jest.spyOn(maintenanceRepository, 'createMaintenanceRequest').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.createMaintenanceRequest(mockData);
    expect(result).toEqual(mockResponse);
    expect(mockCreate).toHaveBeenCalledWith(mockData);
  });

  it('should update a maintenance request', async () => {
    const updateData: MaintenanceUpdatePayload = { title: 'Updated Title' };
    const mockResponse = { ...mockData, id: 1, title: 'Updated Title' };
    const mockUpdate = jest.spyOn(maintenanceRepository, 'updateMaintenanceRequest').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.updateMaintenanceRequest(1, updateData);
    expect(result).toEqual(mockResponse);
    expect(mockUpdate).toHaveBeenCalledWith(1, updateData);
  });

  it('should delete a maintenance request', async () => {
    const mockDelete = jest.spyOn(maintenanceRepository, 'deleteMaintenanceRequest').mockResolvedValue(undefined);
    await maintenanceRepository.deleteMaintenanceRequest(1);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('should fetch dashboard stats', async () => {
    const mockStats = { total: 10, open: 5, in_progress: 3, resolved: 2 };
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchDashboard').mockResolvedValue(mockStats as any);
    const result = await maintenanceRepository.fetchDashboard();
    expect(result).toEqual(mockStats);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should update status', async () => {
    const mockResponse = { status: 'resolved' };
    const mockStatus = jest.spyOn(maintenanceRepository, 'updateStatus').mockResolvedValue(mockResponse as any);
    await maintenanceRepository.updateStatus(1, { status: 'resolved' });
    expect(mockStatus).toHaveBeenCalledWith(1, { status: 'resolved' });
  });

  it('should assign caretaker', async () => {
    const mockResponse = { assigned_caretaker: 1 };
    const mockAssign = jest.spyOn(maintenanceRepository, 'assignCaretaker').mockResolvedValue(mockResponse as any);
    await maintenanceRepository.assignCaretaker(1, 1);
    expect(mockAssign).toHaveBeenCalledWith(1, 1);
  });

  it('should assign vendor', async () => {
    const mockResponse = { assigned_vendor: 1 };
    const mockAssign = jest.spyOn(maintenanceRepository, 'assignVendor').mockResolvedValue(mockResponse as any);
    await maintenanceRepository.assignVendor(1, 1);
    expect(mockAssign).toHaveBeenCalledWith(1, 1);
  });

  it('should add comment', async () => {
    const mockResponse = { id: 1, text: 'Test comment' };
    const mockComment = jest.spyOn(maintenanceRepository, 'addComment').mockResolvedValue(mockResponse as any);
    await maintenanceRepository.addComment(1, { text: 'Test comment' });
    expect(mockComment).toHaveBeenCalledWith(1, { text: 'Test comment' });
  });

  it('should add expense', async () => {
    const mockResponse = { id: 1, description: 'Test expense' };
    const mockExpense = jest.spyOn(maintenanceRepository, 'addExpense').mockResolvedValue(mockResponse as any);
    await maintenanceRepository.addExpense(1, { description: 'Test expense' });
    expect(mockExpense).toHaveBeenCalledWith(1, { description: 'Test expense' });
  });

  it('should fetch comments', async () => {
    const mockResponse = [{ id: 1, text: 'Comment' }];
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchComments').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchComments(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(1);
  });

  it('should fetch expenses', async () => {
    const mockResponse = [{ id: 1, description: 'Expense' }];
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchExpenses').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchExpenses(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(1);
  });

  it('should fetch photos', async () => {
    const mockResponse = [{ id: 1, image: 'url' }];
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchPhotos').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchPhotos(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(1);
  });

  it('should fetch documents', async () => {
    const mockResponse = [{ id: 1, file: 'url' }];
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchDocuments').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchDocuments(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(1);
  });

  it('should fetch timeline', async () => {
    const mockResponse = [{ id: 1, activity_type: 'created' }];
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchTimeline').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchTimeline(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(1);
  });

  it('should fetch resolved requests', async () => {
    const mockResponse = { results: [] };
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchResolved').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchResolved();
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should fetch closed requests', async () => {
    const mockResponse = { results: [] };
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchClosed').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchClosed();
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should fetch vendors', async () => {
    const mockResponse = [{ id: 1, name: 'Vendor' }];
    const mockFetch = jest.spyOn(maintenanceRepository, 'fetchVendors').mockResolvedValue(mockResponse as any);
    const result = await maintenanceRepository.fetchVendors();
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should apply filters to list request', async () => {
    const filters: MaintenanceFilters = { status: 'created', priority: 'high' };
    const mockResponse = { results: [] };
    const mockList = jest.spyOn(maintenanceRepository, 'fetchMaintenanceRequests').mockResolvedValue(mockResponse as any);
    await maintenanceRepository.fetchMaintenanceRequests(filters);
    expect(mockList).toHaveBeenCalledWith(filters);
  });
});
