import mongoose, { Schema, Document } from 'mongoose'

export interface IForecast extends Document {
  productId: mongoose.Types.ObjectId
  forecastType: 'demand' | 'supply' | 'price' | 'yield'
  period: {
    startDate: Date
    endDate: Date
    granularity: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  }
  predictions: Array<{
    date: Date
    predictedValue: number
    confidence: number
    actualValue?: number
    accuracy?: number
  }>
  factors: {
    historicalData: {
      periods: number
      averageValue: number
      trend: 'increasing' | 'decreasing' | 'stable'
    }
    seasonalFactors: {
      seasonality: boolean
      peakSeason: string
      lowSeason: string
    }
    externalFactors: Array<{
      factor: string
      impact: 'positive' | 'negative' | 'neutral'
      weight: number
    }>
  }
  accuracy: {
    mape: number // Mean Absolute Percentage Error
    rmse: number // Root Mean Square Error
    lastUpdated: Date
  }
  recommendations: Array<{
    type: 'production_adjustment' | 'pricing_strategy' | 'inventory_management' | 'supplier_optimization'
    description: string
    impact: 'high' | 'medium' | 'low'
    implementation: string
  }>
  alerts: Array<{
    type: 'demand_spike' | 'supply_shortage' | 'price_volatility' | 'accuracy_drop'
    message: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    timestamp: Date
    resolved: boolean
  }>
  status: 'active' | 'archived' | 'draft'
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ForecastSchema = new Schema<IForecast>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  forecastType: {
    type: String,
    enum: ['demand', 'supply', 'price', 'yield'],
    required: true
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    granularity: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly'],
      required: true
    }
  },
  predictions: [{
    date: {
      type: Date,
      required: true
    },
    predictedValue: {
      type: Number,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    actualValue: {
      type: Number
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  factors: {
    historicalData: {
      periods: {
        type: Number,
        required: true,
        min: 1
      },
      averageValue: {
        type: Number,
        required: true
      },
      trend: {
        type: String,
        enum: ['increasing', 'decreasing', 'stable'],
        required: true
      }
    },
    seasonalFactors: {
      seasonality: {
        type: Boolean,
        default: false
      },
      peakSeason: {
        type: String
      },
      lowSeason: {
        type: String
      }
    },
    externalFactors: [{
      factor: {
        type: String,
        required: true
      },
      impact: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        required: true
      },
      weight: {
        type: Number,
        required: true,
        min: 0,
        max: 1
      }
    }]
  },
  accuracy: {
    mape: {
      type: Number,
      required: true,
      min: 0
    },
    rmse: {
      type: Number,
      required: true,
      min: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  recommendations: [{
    type: {
      type: String,
      enum: ['production_adjustment', 'pricing_strategy', 'inventory_management', 'supplier_optimization'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    impact: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    implementation: {
      type: String,
      required: true
    }
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['demand_spike', 'supply_shortage', 'price_volatility', 'accuracy_drop'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
ForecastSchema.index({ productId: 1 })
ForecastSchema.index({ forecastType: 1 })
ForecastSchema.index({ status: 1 })
ForecastSchema.index({ 'period.startDate': 1 })
ForecastSchema.index({ 'period.endDate': 1 })
ForecastSchema.index({ createdBy: 1 })

export default mongoose.models.Forecast || mongoose.model<IForecast>('Forecast', ForecastSchema) 