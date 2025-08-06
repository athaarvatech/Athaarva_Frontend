"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  FileText
} from "lucide-react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What's the minimum subscription period for Healthcare?",
        answer: "We offer flexible subscription options starting from monthly plans. However, you can save 15% by choosing our annual subscription. All plans include a 14-day free trial with no credit card required."
      },
      {
        question: "Is Healthcare suitable for small clinics with less than 10 beds?",
        answer: "Absolutely! Healthcare is designed specifically for small to medium hospitals and clinics. Our Starter plan supports up to 4 beds, and Professional plan handles up to 8 beds, making it perfect for smaller healthcare facilities."
      },
      {
        question: "Can I migrate my existing patient records to Healthcare?",
        answer: "Yes, we provide free data migration services for all new customers. Our team will help you import your existing patient records, appointment history, and other critical data from your current system with zero downtime."
      }
    ]
  },
  {
    category: "Features",
    questions: [
      {
        question: "Do you offer teleconsultation features?",
        answer: "Yes! Our Professional and Enterprise plans include integrated telehealth capabilities with secure video consultations, screen sharing, digital prescriptions, and patient monitoring tools. The platform is HIPAA-compliant for all video communications."
      },
      {
        question: "How secure is patient data in Healthcare?",
        answer: "Patient data security is our top priority. We use AES-256 encryption, maintain HIPAA compliance, and host on Microsoft Azure's secure infrastructure. We conduct regular security audits and maintain SOC 2 Type II certification."
      },
      {
        question: "Does Healthcare integrate with existing hospital equipment?",
        answer: "Yes, Healthcare offers API integrations with common medical equipment and systems. We can also develop custom integrations for specific equipment in your hospital. Our technical team provides support for seamless integration."
      }
    ]
  },
  {
    category: "Pricing & Support",
    questions: [
      {
        question: "Are there any hidden fees or setup costs?",
        answer: "No hidden fees! Our pricing is completely transparent. Setup, data migration, training, and ongoing support are all included in your subscription. The only additional costs might be optional add-on modules you choose to activate."
      },
      {
        question: "What kind of support do you provide?",
        answer: "We provide 24/7 technical support via email and chat for all customers. Professional plan customers get priority support, and Enterprise customers receive dedicated phone support with a guaranteed response time."
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time. There are no cancellation fees or long-term contracts. We'll help you export your data before cancellation, and you'll retain access until the end of your billing period."
      }
    ]
  }
];

function FAQSection() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("General");

  const toggleItem = (questionId: string) => {
    setOpenItems(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const currentFAQs = faqs.find(category => category.category === activeCategory)?.questions || [];

  return (
    <section className="py-24 bg-gradient-to-b from-healthcare-cool-white to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-6 h-6 text-healthcare-primary mr-2" />
            <p className="text-healthcare-primary font-semibold text-sm uppercase tracking-wider">
              Frequently Asked Questions
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Got Questions?
            <span className="bg-gradient-to-r from-healthcare-primary to-healthcare-teal bg-clip-text text-transparent">
              {" "}We&apos;ve Got Answers
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about Healthcare, or get in touch 
            with our support team for personalized assistance.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200 flex space-x-2">
            {faqs.map((category) => (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === category.category
                    ? 'bg-healthcare-primary text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          {currentFAQs.map((faq, index) => {
            const questionId = `${activeCategory}-${index}`;
            const isOpen = openItems.includes(questionId);

            return (
              <motion.div
                key={questionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(questionId)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-healthcare-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 pt-2">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-gradient-to-br from-healthcare-primary to-healthcare-teal rounded-3xl p-12 text-white"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Still have questions?</h3>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we&apos;ll respond within 2 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <MessageCircle className="w-10 h-10 text-white mx-auto mb-4" />
                <h4 className="text-lg font-bold mb-2">Live Chat</h4>
                <p className="text-white/80 text-sm mb-4">Chat with our support team in real-time</p>
                <button className="bg-white text-healthcare-primary px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors duration-300">
                  Start Chat
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Mail className="w-10 h-10 text-white mx-auto mb-4" />
                <h4 className="text-lg font-bold mb-2">Email Support</h4>
                <p className="text-white/80 text-sm mb-4">Get detailed help via email</p>
                <button className="bg-white text-healthcare-primary px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors duration-300">
                  Send Email
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Phone className="w-10 h-10 text-white mx-auto mb-4" />
                <h4 className="text-lg font-bold mb-2">Phone Support</h4>
                <p className="text-white/80 text-sm mb-4">Speak directly with our experts</p>
                <button className="bg-white text-healthcare-primary px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors duration-300">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
        >
          <div className="text-center">
            <FileText className="w-12 h-12 text-healthcare-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our comprehensive documentation, tutorials, and guides to get the most out of Healthcare.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-healthcare-primary/10 text-healthcare-primary px-6 py-4 rounded-xl font-semibold hover:bg-healthcare-primary/20 transition-colors duration-300">
                📖 User Documentation
              </button>
              <button className="bg-healthcare-primary/10 text-healthcare-primary px-6 py-4 rounded-xl font-semibold hover:bg-healthcare-primary/20 transition-colors duration-300">
                🎥 Video Tutorials
              </button>
              <button className="bg-healthcare-primary/10 text-healthcare-primary px-6 py-4 rounded-xl font-semibold hover:bg-healthcare-primary/20 transition-colors duration-300">
                🚀 Getting Started Guide
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQSection;
