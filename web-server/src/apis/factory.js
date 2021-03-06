const factory = (Modal, option = {}) => {
  const create = async (req, res) => {
    const modal = new Modal(req.body);
    try {
      await modal.save();
      return res.status(201).send(modal)
    } catch (err) {
      return res.status(500).send(err.toString());
    }
  };
  
  const read = async (req, res) => {
    let id = req.params.id;
    try {
      if (id) {
        const modal = await Modal.findById(id);
        if (modal) {
          return res.status(200).send(modal);
        } else {
          return res.status(404).send(`no data with Id=${id}`);
        }
      } else {
        const modals = await Modal.find();
        return res.status(200).send(modals);
      }
    } catch (err) {
      return res.status(500).send(err.toString());
    }
  };

  const update = async (req, res) => {
    let id = req.params.id;
    try {
      if (!id) {
        return res.status(400).send('no id, can not update');
      }
      let isValidUpdate = true;
      if (option.allowedUpdateFields) {
        const allowedUpdateFields = option.allowedUpdateFields;
        isValidUpdate = Object.keys(req.body).every(key => allowedUpdateFields.includes(key));
      }
      if (!isValidUpdate) {
        return res.status(400).send('invalid field to update');
      }
      let modal = await Modal.findById(id);
      if (!modal) {
        return res.status(404).send(`no data with Id=${id}`);
      }
      modal = Object.assign(modal, req.body);
      await modal.save();
      return res.status(200).send(modal);
    } catch (err) {
      return res.status(500).send(err.toString());
    }
  };
  
  const del = async (req, res) => {
    let id = req.params.id;
    try {
      if (!id) {
        return res.status(400).send('no id, can not delete');
      }
      const modal = await Modal.findByIdAndDelete(id);
      if (!modal) {
        return res.status(404).send(`no data with Id=${id}`);
      } else {
        return res.status(200).send(modal);
      }
    } catch (err) {
      return res.status(500).send(err.toString());
    }
  };

  return {create, read, update, del};
}

module.exports = factory;