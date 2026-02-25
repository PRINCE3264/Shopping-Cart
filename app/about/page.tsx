"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles, Zap, Users, Globe, Award, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: <Sparkles className="text-white" size={32} />,
      title: "ESTHETIC PURITY",
      desc: "Our design language focuses on extreme minimalism and architectural integrity.",
      color: "bg-indigo-600"
    },
    {
      icon: <Award className="text-white" size={32} />,
      title: "CRAFT MASTERY",
      desc: "Every object is vetted through a rigorous quality control framework before acquisition.",
      color: "bg-gray-900"
    },
    {
      icon: <Users className="text-white" size={32} />,
      title: "ELITE COMMUNITY",
      desc: "We serve a global circle of forward-thinking individuals focused on performance lifestyle.",
      color: "bg-gray-500"
    }
  ];

  const milestones = [
    { year: "2020", title: "THE GENESIS", desc: "Shopcart was founded as a boutique digital atelier in London." },
    { year: "2022", title: "GLOBAL REACH", desc: "Expanded logistics to 120+ countries with 48h delivery windows." },
    { year: "2024", title: "LEGACY ERA", desc: "Launched the Archival collections, redefining digital luxury." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Pure Architectural UI */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
            <div className="max-w-4xl">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-black tracking-[0.4em] text-indigo-600 uppercase mb-8 block"
              >
                The Essence of Shopcart
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-6xl md:text-[120px] font-black text-gray-900 leading-[0.85] tracking-tighter mb-12"
              >
                ARCHITECTING <br /> THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-400">MODERN LEGACY.</span>
              </motion.h1>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="w-full h-[500px] md:h-[700px] relative rounded-[60px] overflow-hidden mt-12 bg-gray-100"
          >
            <Image
              src="https://images.unsplash.com/photo-1497366754035-817de72658f6?q=80&w=2070"
              alt="Studio View"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 italic">
              "We don't sell objects. We curate performance for the elite minimalist."
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-8">
              Shopcart was born out of a desire to eliminate the noise of modern consumerism. We focus on structural integrity, technical material innovation, and aesthetic longevity.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-black text-gray-900">50K+</p>
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Members</p>
              </div>
              <div>
                <p className="text-4xl font-black text-gray-900">120+</p>
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Countries</p>
              </div>
              <div>
                <p className="text-4xl font-black text-gray-900">Premium</p>
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Selection</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex items-start gap-8 group hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-3xl shrink-0 flex items-center justify-center ${v.color} group-hover:scale-110 transition-transform`}>
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 font-medium">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 bg-gray-900 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-xs font-black tracking-[0.4em] text-indigo-500 uppercase mb-4 block">Our Journey</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">THE EVOLUTION OF <br /> <span className="text-gray-600">STRUCTURE.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Background Line */}
            <div className="hidden md:block absolute top-[60px] left-0 w-full h-[1px] bg-gray-800" />

            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-10 border-8 border-gray-900 shadow-xl mx-auto md:mx-0">
                  <span className="font-black text-xs">{m.year}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-center md:text-left">{m.title}</h3>
                <p className="text-gray-400 font-medium text-center md:text-left leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders / Team Section */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24">
          <div className="w-full md:w-1/2 aspect-square relative rounded-[60px] overflow-hidden group shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1491333078588-55b6733c7de6?q=80&w=800"
              alt="Founder"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
          </div>

          <div className="w-full md:w-1/2">
            <span className="text-xs font-black tracking-[0.4em] text-gray-400 uppercase mb-4 block">Meet the Curators</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 italic">"We believe in objects that outlive trends."</h2>
            <div className="space-y-6">
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Founded by designers who were tired of the "fast fashion" cycle, Shopcart is a response to the need for permanence in a digital first world.
              </p>
              <div className="pt-8">
                <p className="text-2xl font-black text-gray-900">ARTHUR VANCE</p>
                <p className="text-xs font-black text-indigo-600 tracking-widest uppercase">CEO & Chief Curator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gray-100 rounded-[60px] p-20 border border-gray-200"
          >
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.9]">
              READY TO CHOOSE <br /> <span className="text-gray-400">YOUR LEGACY?</span>
            </h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black group hover:bg-indigo-600 transition-all"
            >
              START YOUR COLLECTION <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}