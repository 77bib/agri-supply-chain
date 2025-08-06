"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts"
import {
  Users, MapPin, Calendar, TrendingUp, Award, Star, Phone, Mail, 
  Globe, Leaf, Wheat, Apple, Carrot, Corn, Grape, Tomato, Pepper,
  Plus, Search, Filter, RefreshCw, Eye, Edit, Trash2, Download,
  Upload, MoreHorizontal, CheckCircle, AlertTriangle, Clock,
  Thermometer, Droplets, Sun, Cloud, Rain, Wind, Gauge, Timer,
  Target, Zap, Heart, Trophy, Medal, Crown, Gem, Diamond,
  Coins, Wallet, PiggyBank, Banknote, Receipt, Calculator,
  Percent, Hash, Activity, BarChart3, PieChart as PieChartIcon
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { toast } from "sonner"

// Mock data for demonstration - 28 Algerian Farmers with Farm Images
const mockFarmers = [
  {
    _id: "1",
    name: "Ahmed Benali",
    email: "ahmed.benali@email.com",
    phone: "+213 555 123 456",
    farmName: "Green Valley Farm",
    farmSize: 150,
    farmLocation: {
      address: "Route Nationale 1, Km 45",
      city: "Blida",
      state: "Blida Province",
      coordinates: { lat: 36.4700, lng: 2.8300 }
    },
    certifications: ["Organic", "GlobalGAP", "ISO 22000"],
    crops: ["Tomatoes", "Peppers", "Cucumbers"],
    performance: {
      totalHarvested: 25000,
      averageYield: 85,
      qualityScore: 92,
      lastHarvestDate: new Date("2024-01-15")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=400&fit=crop",
    experience: 8,
    rating: 4.8,
    totalOrders: 156,
    revenue: 45000,
    farmType: "Greenhouse",
    irrigationSystem: "Drip",
    soilType: "Sandy Loam",
    elevation: 120,
    annualRainfall: 650
  },
  {
    _id: "2",
    name: "Fatima Zohra",
    email: "fatima.zohra@email.com",
    phone: "+213 555 234 567",
    farmName: "Sunshine Organic Farm",
    farmSize: 200,
    farmLocation: {
      address: "Chemin Rural 12",
      city: "Tipaza",
      state: "Tipaza Province",
      coordinates: { lat: 36.5897, lng: 2.4477 }
    },
    certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
    crops: ["Strawberries", "Raspberries", "Blueberries"],
    performance: {
      totalHarvested: 18000,
      averageYield: 78,
      qualityScore: 95,
      lastHarvestDate: new Date("2024-01-20")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    experience: 12,
    rating: 4.9,
    totalOrders: 203,
    revenue: 52000,
    farmType: "Berry Farm",
    irrigationSystem: "Sprinkler",
    soilType: "Clay Loam",
    elevation: 85,
    annualRainfall: 720
  },
  {
    _id: "3",
    name: "Mohammed Boudiaf",
    email: "mohammed.boudiaf@email.com",
    phone: "+213 555 345 678",
    farmName: "Golden Wheat Fields",
    farmSize: 300,
    farmLocation: {
      address: "Zone Agricole 5",
      city: "Constantine",
      state: "Constantine Province",
      coordinates: { lat: 36.3650, lng: 6.6147 }
    },
    certifications: ["ISO 22000", "HACCP", "GlobalGAP"],
    crops: ["Wheat", "Barley", "Oats"],
    performance: {
      totalHarvested: 45000,
      averageYield: 82,
      qualityScore: 88,
      lastHarvestDate: new Date("2024-01-10")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop",
    experience: 15,
    rating: 4.7,
    totalOrders: 189,
    revenue: 38000,
    farmType: "Grain Farm",
    irrigationSystem: "Center Pivot",
    soilType: "Silty Clay",
    elevation: 650,
    annualRainfall: 580
  },
  {
    _id: "4",
    name: "Amina Cherif",
    email: "amina.cherif@email.com",
    phone: "+213 555 456 789",
    farmName: "Olive Grove Estate",
    farmSize: 120,
    farmLocation: {
      address: "Domaine Agricole 8",
      city: "Oran",
      state: "Oran Province",
      coordinates: { lat: 35.6971, lng: -0.6337 }
    },
    certifications: ["Organic", "PDO", "Traditional Specialty"],
    crops: ["Olives", "Almonds", "Figs"],
    performance: {
      totalHarvested: 12000,
      averageYield: 90,
      qualityScore: 96,
      lastHarvestDate: new Date("2024-01-25")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1515589666096-d88c6016b6e3?w=400&h=400&fit=crop",
    experience: 20,
    rating: 5.0,
    totalOrders: 245,
    revenue: 65000,
    farmType: "Orchard",
    irrigationSystem: "Micro-sprinkler",
    soilType: "Calcareous",
    elevation: 200,
    annualRainfall: 450
  },
  {
    _id: "5",
    name: "Karim Messaoudi",
    email: "karim.messaoudi@email.com",
    phone: "+213 555 567 890",
    farmName: "Vineyard Paradise",
    farmSize: 180,
    farmLocation: {
      address: "Coteaux Viticoles 3",
      city: "Annaba",
      state: "Annaba Province",
      coordinates: { lat: 36.9000, lng: 7.7667 }
    },
    certifications: ["Organic", "Biodynamic", "Vegan"],
    crops: ["Grapes", "Pears", "Apples"],
    performance: {
      totalHarvested: 22000,
      averageYield: 87,
      qualityScore: 93,
      lastHarvestDate: new Date("2024-01-18")
    },
    status: "inactive",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop",
    experience: 10,
    rating: 4.6,
    totalOrders: 134,
    revenue: 42000,
    farmType: "Vineyard",
    irrigationSystem: "Trellis",
    soilType: "Volcanic",
    elevation: 320,
    annualRainfall: 680
  },
  {
    _id: "6",
    name: "Yasmine Bouzid",
    email: "yasmine.bouzid@email.com",
    phone: "+213 555 678 901",
    farmName: "Rose Garden Farm",
    farmSize: 85,
    farmLocation: {
      address: "Route des Fleurs 7",
      city: "Tlemcen",
      state: "Tlemcen Province",
      coordinates: { lat: 34.8828, lng: -1.3167 }
    },
    certifications: ["Organic", "Fair Trade"],
    crops: ["Roses", "Lavender", "Mint"],
    performance: {
      totalHarvested: 8000,
      averageYield: 88,
      qualityScore: 94,
      lastHarvestDate: new Date("2024-01-22")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1464982328879-9c2d7c3c1c8c?w=400&h=400&fit=crop",
    experience: 6,
    rating: 4.9,
    totalOrders: 98,
    revenue: 28000,
    farmType: "Flower Farm",
    irrigationSystem: "Mist",
    soilType: "Sandy",
    elevation: 150,
    annualRainfall: 550
  },
  {
    _id: "7",
    name: "Hassan Tazi",
    email: "hassan.tazi@email.com",
    phone: "+213 555 789 012",
    farmName: "Desert Oasis Farm",
    farmSize: 250,
    farmLocation: {
      address: "Oasis Route 15",
      city: "Biskra",
      state: "Biskra Province",
      coordinates: { lat: 34.8500, lng: 5.7333 }
    },
    certifications: ["Organic", "ISO 22000"],
    crops: ["Dates", "Palm Hearts", "Cactus Fruit"],
    performance: {
      totalHarvested: 35000,
      averageYield: 91,
      qualityScore: 89,
      lastHarvestDate: new Date("2024-01-12")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1515589666096-d88c6016b6e3?w=400&h=400&fit=crop",
    experience: 18,
    rating: 4.7,
    totalOrders: 167,
    revenue: 55000,
    farmType: "Oasis Farm",
    irrigationSystem: "Traditional",
    soilType: "Desert Sand",
    elevation: 80,
    annualRainfall: 180
  },
  {
    _id: "8",
    name: "Nadia Benchaabane",
    email: "nadia.benchaabane@email.com",
    phone: "+213 555 890 123",
    farmName: "Mountain Herbs Farm",
    farmSize: 95,
    farmLocation: {
      address: "Chemin des Herbes 22",
      city: "Bejaia",
      state: "Bejaia Province",
      coordinates: { lat: 36.7500, lng: 5.0833 }
    },
    certifications: ["Organic", "Traditional Specialty"],
    crops: ["Thyme", "Rosemary", "Sage"],
    performance: {
      totalHarvested: 12000,
      averageYield: 84,
      qualityScore: 97,
      lastHarvestDate: new Date("2024-01-28")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    experience: 14,
    rating: 4.8,
    totalOrders: 145,
    revenue: 32000,
    farmType: "Herb Farm",
    irrigationSystem: "Manual",
    soilType: "Rocky",
    elevation: 850,
    annualRainfall: 800
  },
  {
    _id: "9",
    name: "Omar Zerrouki",
    email: "omar.zerrouki@email.com",
    phone: "+213 555 901 234",
    farmName: "Citrus Valley",
    farmSize: 180,
    farmLocation: {
      address: "Vallée des Agrumes 9",
      city: "Guelma",
      state: "Guelma Province",
      coordinates: { lat: 36.4667, lng: 7.4333 }
    },
    certifications: ["GlobalGAP", "ISO 22000"],
    crops: ["Oranges", "Lemons", "Mandarins"],
    performance: {
      totalHarvested: 28000,
      averageYield: 86,
      qualityScore: 91,
      lastHarvestDate: new Date("2024-01-16")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=400&fit=crop",
    experience: 12,
    rating: 4.6,
    totalOrders: 178,
    revenue: 48000,
    farmType: "Citrus Grove",
    irrigationSystem: "Drip",
    soilType: "Loamy",
    elevation: 280,
    annualRainfall: 600
  },
  {
    _id: "10",
    name: "Leila Mansouri",
    email: "leila.mansouri@email.com",
    phone: "+213 555 012 345",
    farmName: "Berry Bliss Farm",
    farmSize: 110,
    farmLocation: {
      address: "Route des Baies 33",
      city: "Setif",
      state: "Setif Province",
      coordinates: { lat: 36.1900, lng: 5.4100 }
    },
    certifications: ["Organic", "Fair Trade"],
    crops: ["Blackberries", "Gooseberries", "Currants"],
    performance: {
      totalHarvested: 15000,
      averageYield: 79,
      qualityScore: 93,
      lastHarvestDate: new Date("2024-01-24")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    experience: 9,
    rating: 4.7,
    totalOrders: 123,
    revenue: 38000,
    farmType: "Berry Farm",
    irrigationSystem: "Sprinkler",
    soilType: "Acidic",
    elevation: 420,
    annualRainfall: 750
  },
  {
    _id: "11",
    name: "Rachid Belkacemi",
    email: "rachid.belkacemi@email.com",
    phone: "+213 555 123 456",
    farmName: "Highland Grains",
    farmSize: 400,
    farmLocation: {
      address: "Plateau des Céréales 18",
      city: "Batna",
      state: "Batna Province",
      coordinates: { lat: 35.5500, lng: 6.1667 }
    },
    certifications: ["ISO 22000", "HACCP"],
    crops: ["Corn", "Millet", "Sorghum"],
    performance: {
      totalHarvested: 60000,
      averageYield: 83,
      qualityScore: 87,
      lastHarvestDate: new Date("2024-01-08")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop",
    experience: 22,
    rating: 4.5,
    totalOrders: 234,
    revenue: 72000,
    farmType: "Grain Farm",
    irrigationSystem: "Center Pivot",
    soilType: "Clay",
    elevation: 1200,
    annualRainfall: 450
  },
  {
    _id: "12",
    name: "Samira Boudjemaa",
    email: "samira.boudjemaa@email.com",
    phone: "+213 555 234 567",
    farmName: "Coastal Vegetables",
    farmSize: 140,
    farmLocation: {
      address: "Côte des Légumes 25",
      city: "Mostaganem",
      state: "Mostaganem Province",
      coordinates: { lat: 35.9333, lng: 0.0833 }
    },
    certifications: ["Organic", "GlobalGAP"],
    crops: ["Carrots", "Potatoes", "Onions"],
    performance: {
      totalHarvested: 32000,
      averageYield: 89,
      qualityScore: 90,
      lastHarvestDate: new Date("2024-01-19")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=400&fit=crop",
    experience: 11,
    rating: 4.8,
    totalOrders: 189,
    revenue: 42000,
    farmType: "Vegetable Farm",
    irrigationSystem: "Furrow",
    soilType: "Silty",
    elevation: 15,
    annualRainfall: 550
  },
  {
    _id: "13",
    name: "Adel Khelifi",
    email: "adel.khelifi@email.com",
    phone: "+213 555 345 678",
    farmName: "Sunflower Fields",
    farmSize: 220,
    farmLocation: {
      address: "Champs de Tournesols 12",
      city: "Relizane",
      state: "Relizane Province",
      coordinates: { lat: 35.7333, lng: 0.5500 }
    },
    certifications: ["Organic", "ISO 22000"],
    crops: ["Sunflowers", "Safflower", "Flax"],
    performance: {
      totalHarvested: 38000,
      averageYield: 85,
      qualityScore: 88,
      lastHarvestDate: new Date("2024-01-14")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop",
    experience: 16,
    rating: 4.6,
    totalOrders: 156,
    revenue: 58000,
    farmType: "Oil Seed Farm",
    irrigationSystem: "Center Pivot",
    soilType: "Sandy Loam",
    elevation: 180,
    annualRainfall: 480
  },
  {
    _id: "14",
    name: "Djamila Benali",
    email: "djamila.benali@email.com",
    phone: "+213 555 456 789",
    farmName: "Aromatic Herbs Garden",
    farmSize: 75,
    farmLocation: {
      address: "Jardin des Aromates 8",
      city: "Tizi Ouzou",
      state: "Tizi Ouzou Province",
      coordinates: { lat: 36.7167, lng: 4.0500 }
    },
    certifications: ["Organic", "Traditional Specialty"],
    crops: ["Basil", "Oregano", "Marjoram"],
    performance: {
      totalHarvested: 9000,
      averageYield: 92,
      qualityScore: 95,
      lastHarvestDate: new Date("2024-01-26")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    experience: 7,
    rating: 4.9,
    totalOrders: 87,
    revenue: 25000,
    farmType: "Herb Garden",
    irrigationSystem: "Drip",
    soilType: "Well-drained",
    elevation: 650,
    annualRainfall: 850
  },
  {
    _id: "15",
    name: "Malik Saadi",
    email: "malik.saadi@email.com",
    phone: "+213 555 567 890",
    farmName: "Pistachio Grove",
    farmSize: 160,
    farmLocation: {
      address: "Verger de Pistaches 14",
      city: "Mascara",
      state: "Mascara Province",
      coordinates: { lat: 35.4000, lng: 0.1333 }
    },
    certifications: ["Organic", "PDO"],
    crops: ["Pistachios", "Walnuts", "Hazelnuts"],
    performance: {
      totalHarvested: 18000,
      averageYield: 87,
      qualityScore: 94,
      lastHarvestDate: new Date("2024-01-21")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1515589666096-d88c6016b6e3?w=400&h=400&fit=crop",
    experience: 19,
    rating: 4.7,
    totalOrders: 134,
    revenue: 68000,
    farmType: "Nut Orchard",
    irrigationSystem: "Micro-sprinkler",
    soilType: "Deep Sandy",
    elevation: 320,
    annualRainfall: 420
  },
  {
    _id: "16",
    name: "Zineb Merzougui",
    email: "zineb.merzougui@email.com",
    phone: "+213 555 678 901",
    farmName: "Tea Plantation",
    farmSize: 90,
    farmLocation: {
      address: "Plantation de Thé 6",
      city: "Jijel",
      state: "Jijel Province",
      coordinates: { lat: 36.8167, lng: 5.7667 }
    },
    certifications: ["Organic", "Fair Trade"],
    crops: ["Green Tea", "Mint Tea", "Herbal Tea"],
    performance: {
      totalHarvested: 11000,
      averageYield: 90,
      qualityScore: 96,
      lastHarvestDate: new Date("2024-01-23")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    experience: 13,
    rating: 4.8,
    totalOrders: 112,
    revenue: 35000,
    farmType: "Tea Estate",
    irrigationSystem: "Overhead",
    soilType: "Acidic",
    elevation: 750,
    annualRainfall: 1200
  },
  {
    _id: "17",
    name: "Bilal Hamidi",
    email: "bilal.hamidi@email.com",
    phone: "+213 555 789 012",
    farmName: "Mushroom Farm",
    farmSize: 45,
    farmLocation: {
      address: "Ferme des Champignons 11",
      city: "Souk Ahras",
      state: "Souk Ahras Province",
      coordinates: { lat: 36.2833, lng: 7.9500 }
    },
    certifications: ["Organic", "ISO 22000"],
    crops: ["Button Mushrooms", "Oyster Mushrooms", "Shiitake"],
    performance: {
      totalHarvested: 8000,
      averageYield: 94,
      qualityScore: 91,
      lastHarvestDate: new Date("2024-01-27")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=400&fit=crop",
    experience: 8,
    rating: 4.6,
    totalOrders: 76,
    revenue: 22000,
    farmType: "Indoor Farm",
    irrigationSystem: "Mist",
    soilType: "Substrate",
    elevation: 450,
    annualRainfall: 600
  },
  {
    _id: "18",
    name: "Nawel Bensalem",
    email: "nawel.bensalem@email.com",
    phone: "+213 555 890 123",
    farmName: "Honey Bee Farm",
    farmSize: 60,
    farmLocation: {
      address: "Rucher des Abeilles 17",
      city: "El Tarf",
      state: "El Tarf Province",
      coordinates: { lat: 36.7667, lng: 8.3167 }
    },
    certifications: ["Organic", "Traditional Specialty"],
    crops: ["Honey", "Beeswax", "Propolis"],
    performance: {
      totalHarvested: 5000,
      averageYield: 88,
      qualityScore: 98,
      lastHarvestDate: new Date("2024-01-29")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1464982328879-9c2d7c3c1c8c?w=400&h=400&fit=crop",
    experience: 5,
    rating: 4.9,
    totalOrders: 89,
    revenue: 18000,
    farmType: "Apiary",
    irrigationSystem: "Natural",
    soilType: "Wildflower",
    elevation: 280,
    annualRainfall: 700
  },
  {
    _id: "19",
    name: "Younes Ait Ali",
    email: "younes.ait.ali@email.com",
    phone: "+213 555 901 234",
    farmName: "Quinoa Fields",
    farmSize: 130,
    farmLocation: {
      address: "Champs de Quinoa 20",
      city: "Tamanrasset",
      state: "Tamanrasset Province",
      coordinates: { lat: 22.7850, lng: 5.5228 }
    },
    certifications: ["Organic", "Fair Trade"],
    crops: ["Quinoa", "Amaranth", "Chia Seeds"],
    performance: {
      totalHarvested: 16000,
      averageYield: 82,
      qualityScore: 93,
      lastHarvestDate: new Date("2024-01-17")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop",
    experience: 10,
    rating: 4.7,
    totalOrders: 145,
    revenue: 42000,
    farmType: "Ancient Grain Farm",
    irrigationSystem: "Flood",
    soilType: "Sandy",
    elevation: 1400,
    annualRainfall: 150
  },
  {
    _id: "20",
    name: "Hakima Benchaabane",
    email: "hakima.benchaabane@email.com",
    phone: "+213 555 012 345",
    farmName: "Saffron Garden",
    farmSize: 55,
    farmLocation: {
      address: "Jardin de Safran 13",
      city: "Ghardaia",
      state: "Ghardaia Province",
      coordinates: { lat: 32.4833, lng: 3.6667 }
    },
    certifications: ["Organic", "PDO", "Traditional Specialty"],
    crops: ["Saffron", "Turmeric", "Ginger"],
    performance: {
      totalHarvested: 3000,
      averageYield: 95,
      qualityScore: 99,
      lastHarvestDate: new Date("2024-01-30")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    experience: 25,
    rating: 5.0,
    totalOrders: 67,
    revenue: 85000,
    farmType: "Spice Garden",
    irrigationSystem: "Hand Watering",
    soilType: "Well-drained",
    elevation: 450,
    annualRainfall: 200
  },
  {
    _id: "21",
    name: "Riyad Boudiaf",
    email: "riyad.boudiaf@email.com",
    phone: "+213 555 123 456",
    farmName: "Lentil Plains",
    farmSize: 280,
    farmLocation: {
      address: "Plaines des Lentilles 26",
      city: "Tiaret",
      state: "Tiaret Province",
      coordinates: { lat: 35.3667, lng: 1.3167 }
    },
    certifications: ["ISO 22000", "HACCP"],
    crops: ["Lentils", "Chickpeas", "Fava Beans"],
    performance: {
      totalHarvested: 42000,
      averageYield: 86,
      qualityScore: 89,
      lastHarvestDate: new Date("2024-01-11")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop",
    experience: 17,
    rating: 4.5,
    totalOrders: 198,
    revenue: 52000,
    farmType: "Legume Farm",
    irrigationSystem: "Center Pivot",
    soilType: "Clay Loam",
    elevation: 1100,
    annualRainfall: 380
  },
  {
    _id: "22",
    name: "Souad Hamdi",
    email: "souad.hamdi@email.com",
    phone: "+213 555 234 567",
    farmName: "Artichoke Valley",
    farmSize: 120,
    farmLocation: {
      address: "Vallée des Artichauts 19",
      city: "Ain Defla",
      state: "Ain Defla Province",
      coordinates: { lat: 36.2667, lng: 1.9667 }
    },
    certifications: ["Organic", "GlobalGAP"],
    crops: ["Artichokes", "Cardoons", "Asparagus"],
    performance: {
      totalHarvested: 18000,
      averageYield: 83,
      qualityScore: 92,
      lastHarvestDate: new Date("2024-01-20")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=400&fit=crop",
    experience: 11,
    rating: 4.6,
    totalOrders: 134,
    revenue: 38000,
    farmType: "Perennial Farm",
    irrigationSystem: "Drip",
    soilType: "Silty Clay",
    elevation: 350,
    annualRainfall: 650
  },
  {
    _id: "23",
    name: "Tarek Benmoussa",
    email: "tarek.benmoussa@email.com",
    phone: "+213 555 345 678",
    farmName: "Cactus Farm",
    farmSize: 95,
    farmLocation: {
      address: "Ferme des Cactus 16",
      city: "Laghouat",
      state: "Laghouat Province",
      coordinates: { lat: 33.8000, lng: 2.8833 }
    },
    certifications: ["Organic"],
    crops: ["Prickly Pear", "Aloe Vera", "Agave"],
    performance: {
      totalHarvested: 12000,
      averageYield: 89,
      qualityScore: 90,
      lastHarvestDate: new Date("2024-01-25")
    },
    status: "inactive",
    image: "https://images.unsplash.com/photo-1515589666096-d88c6016b6e3?w=400&h=400&fit=crop",
    experience: 9,
    rating: 4.4,
    totalOrders: 87,
    revenue: 28000,
    farmType: "Succulent Farm",
    irrigationSystem: "Minimal",
    soilType: "Rocky",
    elevation: 750,
    annualRainfall: 120
  },
  {
    _id: "24",
    name: "Amira Benali",
    email: "amira.benali@email.com",
    phone: "+213 555 456 789",
    farmName: "Microgreens Farm",
    farmSize: 35,
    farmLocation: {
      address: "Ferme des Micro-pousses 10",
      city: "Boumerdes",
      state: "Boumerdes Province",
      coordinates: { lat: 36.7667, lng: 3.4667 }
    },
    certifications: ["Organic", "ISO 22000"],
    crops: ["Microgreens", "Sprouts", "Baby Lettuce"],
    performance: {
      totalHarvested: 6000,
      averageYield: 96,
      qualityScore: 97,
      lastHarvestDate: new Date("2024-01-31")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=400&fit=crop",
    experience: 4,
    rating: 4.8,
    totalOrders: 156,
    revenue: 32000,
    farmType: "Hydroponic Farm",
    irrigationSystem: "NFT",
    soilType: "Hydroponic",
    elevation: 25,
    annualRainfall: 750
  },
  {
    _id: "25",
    name: "Khalil Zerrouki",
    email: "khalil.zerrouki@email.com",
    phone: "+213 555 567 890",
    farmName: "Truffle Forest",
    farmSize: 200,
    farmLocation: {
      address: "Forêt des Truffes 24",
      city: "Khenchela",
      state: "Khenchela Province",
      coordinates: { lat: 35.4167, lng: 7.1333 }
    },
    certifications: ["Organic", "Traditional Specialty"],
    crops: ["Black Truffles", "White Truffles", "Morels"],
    performance: {
      totalHarvested: 2000,
      averageYield: 98,
      qualityScore: 100,
      lastHarvestDate: new Date("2024-01-15")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1515589666096-d88c6016b6e3?w=400&h=400&fit=crop",
    experience: 30,
    rating: 5.0,
    totalOrders: 45,
    revenue: 120000,
    farmType: "Forest Farm",
    irrigationSystem: "Natural",
    soilType: "Forest Floor",
    elevation: 1200,
    annualRainfall: 900
  },
  {
    _id: "26",
    name: "Naima Bensalem",
    email: "naima.bensalem@email.com",
    phone: "+213 555 678 901",
    farmName: "Vanilla Greenhouse",
    farmSize: 40,
    farmLocation: {
      address: "Serre de Vanille 21",
      city: "Tebessa",
      state: "Tebessa Province",
      coordinates: { lat: 35.4000, lng: 8.1167 }
    },
    certifications: ["Organic", "Fair Trade"],
    crops: ["Vanilla", "Cinnamon", "Nutmeg"],
    performance: {
      totalHarvested: 4000,
      averageYield: 93,
      qualityScore: 96,
      lastHarvestDate: new Date("2024-01-28")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    experience: 12,
    rating: 4.7,
    totalOrders: 78,
    revenue: 45000,
    farmType: "Greenhouse Farm",
    irrigationSystem: "Mist",
    soilType: "Potting Mix",
    elevation: 850,
    annualRainfall: 550
  },
  {
    _id: "27",
    name: "Wassim Hamdi",
    email: "wassim.hamdi@email.com",
    phone: "+213 555 789 012",
    farmName: "Seaweed Farm",
    farmSize: 80,
    farmLocation: {
      address: "Ferme d'Algues 23",
      city: "Skikda",
      state: "Skikda Province",
      coordinates: { lat: 36.8667, lng: 6.9000 }
    },
    certifications: ["Organic", "ISO 22000"],
    crops: ["Nori", "Wakame", "Kombu"],
    performance: {
      totalHarvested: 15000,
      averageYield: 85,
      qualityScore: 91,
      lastHarvestDate: new Date("2024-01-26")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1464982328879-9c2d7c3c1c8c?w=400&h=400&fit=crop",
    experience: 8,
    rating: 4.5,
    totalOrders: 112,
    revenue: 35000,
    farmType: "Aquaculture Farm",
    irrigationSystem: "Seawater",
    soilType: "Marine",
    elevation: 0,
    annualRainfall: 600
  },
  {
    _id: "28",
    name: "Layla Benmoussa",
    email: "layla.benmoussa@email.com",
    phone: "+213 555 890 123",
    farmName: "Edible Flowers Farm",
    farmSize: 50,
    farmLocation: {
      address: "Jardin des Fleurs Comestibles 27",
      city: "El Oued",
      state: "El Oued Province",
      coordinates: { lat: 33.3667, lng: 6.8667 }
    },
    certifications: ["Organic", "Traditional Specialty"],
    crops: ["Nasturtiums", "Calendula", "Borage"],
    performance: {
      totalHarvested: 3000,
      averageYield: 90,
      qualityScore: 94,
      lastHarvestDate: new Date("2024-01-29")
    },
    status: "active",
    image: "https://images.unsplash.com/photo-1464982328879-9c2d7c3c1c8c?w=400&h=400&fit=crop",
    experience: 6,
    rating: 4.8,
    totalOrders: 89,
    revenue: 28000,
    farmType: "Flower Farm",
    irrigationSystem: "Drip",
    soilType: "Sandy",
    elevation: 85,
    annualRainfall: 180
  }
]

const cropIcons = {
  Tomatoes: Tomato,
  Peppers: Pepper,
  Cucumbers: Carrot,
  Strawberries: Heart,
  Raspberries: Heart,
  Blueberries: Heart,
  Wheat: Wheat,
  Barley: Wheat,
  Oats: Wheat,
  Olives: Leaf,
  Almonds: Leaf,
  Figs: Apple,
  Grapes: Grape,
  Pears: Apple,
  Apples: Apple,
  Corn: Corn,
  Carrots: Carrot
}

const performanceData = [
  { month: "Jan", yield: 85, quality: 92, revenue: 45000 },
  { month: "Feb", yield: 88, quality: 94, revenue: 48000 },
  { month: "Mar", yield: 82, quality: 89, revenue: 42000 },
  { month: "Apr", yield: 90, quality: 96, revenue: 52000 },
  { month: "May", yield: 87, quality: 93, revenue: 49000 },
  { month: "Jun", yield: 92, quality: 95, revenue: 55000 }
]

const cropDistribution = [
  { name: "Vegetables", value: 35, color: "#22c55e" },
  { name: "Fruits", value: 28, color: "#f59e0b" },
  { name: "Grains", value: 22, color: "#8b5cf6" },
  { name: "Nuts", value: 15, color: "#ef4444" }
]

const certificationData = [
  { name: "Organic", value: 65, color: "#10b981" },
  { name: "GlobalGAP", value: 45, color: "#3b82f6" },
  { name: "ISO 22000", value: 38, color: "#f59e0b" },
  { name: "Fair Trade", value: 25, color: "#8b5cf6" },
  { name: "Rainforest Alliance", value: 20, color: "#ef4444" }
]

export default function FarmersPage() {
  const [farmers, setFarmers] = useState(mockFarmers)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cropFilter, setCropFilter] = useState("all")
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const handleRefresh = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success("Farmers data refreshed successfully!")
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || farmer.status === statusFilter
    const matchesCrop = cropFilter === "all" || farmer.crops.some(crop => crop.toLowerCase().includes(cropFilter.toLowerCase()))
    return matchesSearch && matchesStatus && matchesCrop
  })

  const stats = {
    totalFarmers: farmers.length,
    activeFarmers: farmers.filter(f => f.status === "active").length,
    totalFarmSize: farmers.reduce((sum, f) => sum + f.farmSize, 0),
    averageYield: Math.round(farmers.reduce((sum, f) => sum + f.performance.averageYield, 0) / farmers.length),
    totalRevenue: farmers.reduce((sum, f) => sum + f.revenue, 0),
    averageRating: (farmers.reduce((sum, f) => sum + f.rating, 0) / farmers.length).toFixed(1)
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              Farmers Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and monitor your network of agricultural partners</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Farmer
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Farmers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalFarmers}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: "0.1s"}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Farmers</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeFarmers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: "0.2s"}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Farm Size</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalFarmSize} ha</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: "0.3s"}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farmers">Farmers List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>Monthly yield, quality, and revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="quality" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Crop Distribution */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Crop Distribution
                  </CardTitle>
                  <CardDescription>Percentage of different crop types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={cropDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {cropDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Top Performing Farmers
                </CardTitle>
                <CardDescription>Farmers with highest quality scores and yields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {farmers
                    .sort((a, b) => b.performance.qualityScore - a.performance.qualityScore)
                    .slice(0, 3)
                    .map((farmer, index) => (
                      <div key={farmer._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative">
                          <img
                            src={farmer.image}
                            alt={farmer.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {index === 0 && <Crown className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1" />}
                          {index === 1 && <Medal className="h-5 w-5 text-gray-500 absolute -top-1 -right-1" />}
                          {index === 2 && <Gem className="h-5 w-5 text-orange-500 absolute -top-1 -right-1" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{farmer.name}</h4>
                          <p className="text-sm text-gray-600">{farmer.farmName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{farmer.rating}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className={`text-sm font-medium ${getPerformanceColor(farmer.performance.qualityScore)}`}>
                              {farmer.performance.qualityScore}% quality
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmers List Tab */}
          <TabsContent value="farmers" className="space-y-6">
            {/* Filters */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search farmers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={cropFilter} onValueChange={setCropFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Crop Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Crops</SelectItem>
                      <SelectItem value="tomatoes">Tomatoes</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="olives">Olives</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Farmers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFarmers.map((farmer) => {
                const CropIcon = cropIcons[farmer.crops[0] as keyof typeof cropIcons] || Leaf
                
                return (
                  <Card key={farmer._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group animate-fade-in">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
                        <img
                          src={farmer.image}
                          alt={farmer.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                        <div className="absolute top-4 right-4">
                          {getStatusBadge(farmer.status)}
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center gap-2 text-white">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-semibold">{farmer.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{farmer.name}</CardTitle>
                          <CardDescription className="text-sm">{farmer.farmName}</CardDescription>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Farmer Actions</DialogTitle>
                              <DialogDescription>Choose an action to perform on this farmer</DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{farmer.farmLocation.city}, {farmer.farmLocation.state}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CropIcon className="h-4 w-4" />
                        <span>{farmer.farmSize} hectares</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {farmer.crops.slice(0, 3).map((crop) => (
                          <Badge key={crop} variant="outline" className="text-xs">
                            {crop}
                          </Badge>
                        ))}
                        {farmer.crops.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{farmer.crops.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{farmer.performance.averageYield}%</p>
                          <p className="text-xs text-gray-600">Yield</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className={`text-2xl font-bold ${getPerformanceColor(farmer.performance.qualityScore)}`}>
                            {farmer.performance.qualityScore}%
                          </p>
                          <p className="text-xs text-gray-600">Quality</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredFarmers.length === 0 && (
              <Card className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 text-lg">No farmers found matching your criteria.</p>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Certifications Chart */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Certifications Distribution
                  </CardTitle>
                  <CardDescription>Number of farmers with each certification</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={certificationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Radar Chart */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Average performance across key metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={[
                      {
                        metric: "Yield",
                        value: stats.averageYield,
                        fullMark: 100,
                      },
                      {
                        metric: "Quality",
                        value: 92,
                        fullMark: 100,
                      },
                      {
                        metric: "Certifications",
                        value: 75,
                        fullMark: 100,
                      },
                      {
                        metric: "Experience",
                        value: 85,
                        fullMark: 100,
                      },
                      {
                        metric: "Revenue",
                        value: 70,
                        fullMark: 100,
                      },
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Performance" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </AdminLayout>
  )
}
