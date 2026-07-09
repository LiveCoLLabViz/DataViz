import axiosInstance from './axiosInstance';
import { ENDPOINTS, API_BASE_URL } from '@/utils/constants';

export const uploadFile = async (workspaceId, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  const headers = {};
  if (token && token !== 'null' && token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}${ENDPOINTS.datasets.upload(workspaceId)}`);
    
    if (headers.Authorization) {
      xhr.setRequestHeader('Authorization', headers.Authorization);
    }
    
    xhr.upload.onprogress = (evt) => {
      if (onProgress && evt.lengthComputable) {
        onProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    };
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else {
        let msg = 'Upload failed';
        try {
          const res = JSON.parse(xhr.responseText);
          msg = res.message || res.error || msg;
        } catch (e) {
          msg = xhr.responseText || msg;
        }
        reject(new Error(msg));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network Error'));
    xhr.send(formData);
  });
};

export const getDatasets = (workspaceId) => 
  axiosInstance.get(ENDPOINTS.datasets.list(workspaceId)).then((r) => r.data);

export const getDataset = (datasetId) => 
  axiosInstance.get(ENDPOINTS.datasets.detail(datasetId)).then((r) => r.data);

export const deleteDataset = (datasetId) => 
  axiosInstance.delete(ENDPOINTS.datasets.delete(datasetId)).then((r) => r.data);

const uploadService = { uploadFile, getDatasets, getDataset, deleteDataset };

export default uploadService;