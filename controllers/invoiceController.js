const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');

const getAllInvoices = async (req, res) => {
  try {
    const { patientId, status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (patientId) query.patient = patientId;
    if (status) query.paymentStatus = status;

    const invoices = await Invoice.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('appointment')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ billDate: -1 });

    const total = await Invoice.countDocuments(query);

    res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('patient')
      .populate('appointment');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { patientId, appointmentId, items, taxRate, discountAmount } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * (taxRate || 5)) / 100;
    const totalAmount = subtotal + taxAmount - (discountAmount || 0);
    const balanceDue = totalAmount;

    const invoice = new Invoice({
      patient: patientId,
      appointment: appointmentId,
      items,
      subtotal,
      taxAmount,
      taxRate: taxRate || 5,
      discountAmount: discountAmount || 0,
      totalAmount,
      balanceDue,
      paymentStatus: 'Pending'
    });

    await invoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { amountPaid, paymentMethod, paymentDate } = req.body;

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const newAmountPaid = (invoice.amountPaid || 0) + amountPaid;
    const balanceDue = invoice.totalAmount - newAmountPaid;
    const paymentStatus = balanceDue <= 0 ? 'Paid' : balanceDue < invoice.totalAmount ? 'Partial' : 'Pending';

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        amountPaid: newAmountPaid,
        balanceDue: Math.max(0, balanceDue),
        paymentStatus,
        paymentMethod,
        paymentDate: paymentDate || Date.now(),
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({ message: 'Payment recorded successfully', invoice: updatedInvoice });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updatePayment
};
