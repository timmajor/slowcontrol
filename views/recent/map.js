function(doc) {
  if (doc.timestamp && !(doc.ios)) {
      emit(doc.timestamp,doc) 
  }
};
