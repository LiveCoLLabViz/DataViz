import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const chartSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  dashboardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashboard',
    
  },
  datasetId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    
  },
  chartType: {
    type: String,
    enum: ['bar', 'pie','line','histogram'],
    required: true
  },
 xaxis : {
    type: String,
    required: true
 },
 yaxis:{
    type: String,
    required: true
 },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  filters: [
    {
        field: { type: String },
        operator: { type: String  },
        value: { type: String }
    }
  ],
    
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },

});

const Chart = mongoose.model('Chart', chartSchema);

export default Chart;