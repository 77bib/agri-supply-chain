import mongoose, { Schema, Document } from 'mongoose'

export interface ITransport extends Document {
  vehicleId: string
  vehicleType: 'truck' | 'van' | 'refrigerated_truck' | 'container'
  licensePlate: string
  driver: {
    name: string
    phone: string
    licenseNumber: string
    experience: number // years
  }
  route: {
    origin: {
      address: string
      coordinates: {
        lat: number
        lng: number
      }
    }
    destination: {
      address: string
      coordinates: {
        lat: number
        lng: number
      }
    }
    waypoints: Array<{
      address: string
      coordinates: {
        lat: number
        lng: number
      }
      estimatedTime: Date
    }>
  }
  shipment: {
    orderId: mongoose.Types.ObjectId
    products: Array<{
      productId: mongoose.Types.ObjectId
      quantity: number
      weight: number
    }>
    totalWeight: number
    specialRequirements: string[]
  }
  status: 'scheduled' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled'
  schedule: {
    departureTime: Date
    estimatedArrival: Date
    actualDeparture: Date
    actualArrival: Date
  }
  tracking: {
    currentLocation: {
      lat: number
      lng: number
      timestamp: Date
    }
    temperature: number
    humidity: number
    speed: number
    fuelLevel: number
  }
  alerts: Array<{
    type: 'delay' | 'temperature_deviation' | 'route_deviation' | 'fuel_low' | 'maintenance'
    message: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    timestamp: Date
    resolved: boolean
  }>
  createdAt: Date
  updatedAt: Date
}

const TransportSchema = new Schema<ITransport>({
  vehicleId: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['truck', 'van', 'refrigerated_truck', 'container'],
    required: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  driver: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    licenseNumber: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    }
  },
  route: {
    origin: {
      address: {
        type: String,
        required: true
      },
      coordinates: {
        lat: {
          type: Number,
          required: true
        },
        lng: {
          type: Number,
          required: true
        }
      }
    },
    destination: {
      address: {
        type: String,
        required: true
      },
      coordinates: {
        lat: {
          type: Number,
          required: true
        },
        lng: {
          type: Number,
          required: true
        }
      }
    },
    waypoints: [{
      address: {
        type: String,
        required: true
      },
      coordinates: {
        lat: {
          type: Number,
          required: true
        },
        lng: {
          type: Number,
          required: true
        }
      },
      estimatedTime: {
        type: Date,
        required: true
      }
    }]
  },
  shipment: {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    products: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      weight: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    totalWeight: {
      type: Number,
      required: true,
      min: 0
    },
    specialRequirements: [{
      type: String,
      enum: ['refrigeration', 'fragile', 'hazardous', 'express', 'signature_required']
    }]
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_transit', 'delivered', 'delayed', 'cancelled'],
    default: 'scheduled'
  },
  schedule: {
    departureTime: {
      type: Date,
      required: true
    },
    estimatedArrival: {
      type: Date,
      required: true
    },
    actualDeparture: {
      type: Date,
      default: null
    },
    actualArrival: {
      type: Date,
      default: null
    }
  },
  tracking: {
    currentLocation: {
      lat: {
        type: Number,
        default: null
      },
      lng: {
        type: Number,
        default: null
      },
      timestamp: {
        type: Date,
        default: null
      }
    },
    temperature: {
      type: Number,
      default: null
    },
    humidity: {
      type: Number,
      default: null
    },
    speed: {
      type: Number,
      default: null
    },
    fuelLevel: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    }
  },
  alerts: [{
    type: {
      type: String,
      enum: ['delay', 'temperature_deviation', 'route_deviation', 'fuel_low', 'maintenance'],
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
  }]
}, {
  timestamps: true
})

// Indexes for better query performance
TransportSchema.index({ vehicleId: 1 })
TransportSchema.index({ licensePlate: 1 })
TransportSchema.index({ status: 1 })
TransportSchema.index({ 'schedule.departureTime': 1 })
TransportSchema.index({ 'shipment.orderId': 1 })
TransportSchema.index({ 'driver.licenseNumber': 1 })

export default mongoose.models.Transport || mongoose.model<ITransport>('Transport', TransportSchema) 