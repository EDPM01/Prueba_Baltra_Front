// Estados de mensaje
export const MESSAGE_STATES = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  SENDING: 'sending',
  SENT: 'sent',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  RETRY: 'retry'
};

// Estados de envío
export const DELIVERY_STATES = {
  PENDING: 'pending',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
  BLOCKED: 'blocked'
};

// Configuración de estados con metadatos
export const MESSAGE_STATE_CONFIG = {
  [MESSAGE_STATES.DRAFT]: {
    label: 'Borrador',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    icon: 'Edit',
    canEdit: true,
    canDelete: true,
    canDuplicate: true,
    canSchedule: true,
    description: 'Mensaje en proceso de creación'
  },
  [MESSAGE_STATES.SCHEDULED]: {
    label: 'Programado',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    icon: 'Clock',
    canEdit: true,
    canDelete: true,
    canDuplicate: true,
    canPause: true,
    canCancel: true,
    description: 'Esperando hora de envío'
  },
  [MESSAGE_STATES.SENDING]: {
    label: 'Enviando',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    icon: 'Send',
    canPause: true,
    canCancel: true,
    description: 'Enviando a destinatarios',
    animated: true
  },
  [MESSAGE_STATES.SENT]: {
    label: 'Enviado',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: 'CheckCircle',
    canDuplicate: true,
    canViewStats: true,
    description: 'Enviado exitosamente'
  },
  [MESSAGE_STATES.PAUSED]: {
    label: 'Pausado',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    icon: 'Pause',
    canEdit: true,
    canResume: true,
    canCancel: true,
    canDelete: true,
    description: 'Envío pausado temporalmente'
  },
  [MESSAGE_STATES.CANCELLED]: {
    label: 'Cancelado',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    icon: 'X',
    canDelete: true,
    canDuplicate: true,
    description: 'Envío cancelado por el usuario'
  },
  [MESSAGE_STATES.FAILED]: {
    label: 'Error',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    icon: 'AlertCircle',
    canRetry: true,
    canEdit: true,
    canDelete: true,
    canViewError: true,
    description: 'Error en el envío'
  },
  [MESSAGE_STATES.RETRY]: {
    label: 'Reintentando',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    icon: 'RotateCcw',
    canPause: true,
    canCancel: true,
    description: 'Reintentando envío',
    animated: true
  }
};

// Configuración de estados de entrega
export const DELIVERY_STATE_CONFIG = {
  [DELIVERY_STATES.PENDING]: {
    label: 'Pendiente',
    color: 'gray',
    icon: 'Clock'
  },
  [DELIVERY_STATES.DELIVERED]: {
    label: 'Entregado',
    color: 'green',
    icon: 'Check'
  },
  [DELIVERY_STATES.READ]: {
    label: 'Leído',
    color: 'blue',
    icon: 'CheckCheck'
  },
  [DELIVERY_STATES.FAILED]: {
    label: 'Falló',
    color: 'red',
    icon: 'X'
  },
  [DELIVERY_STATES.BLOCKED]: {
    label: 'Bloqueado',
    color: 'orange',
    icon: 'Shield'
  }
};

// Transiciones de estado permitidas
export const STATE_TRANSITIONS = {
  [MESSAGE_STATES.DRAFT]: [MESSAGE_STATES.SCHEDULED, MESSAGE_STATES.CANCELLED],
  [MESSAGE_STATES.SCHEDULED]: [
    MESSAGE_STATES.SENDING, 
    MESSAGE_STATES.PAUSED, 
    MESSAGE_STATES.CANCELLED,
    MESSAGE_STATES.DRAFT
  ],
  [MESSAGE_STATES.SENDING]: [
    MESSAGE_STATES.SENT, 
    MESSAGE_STATES.FAILED, 
    MESSAGE_STATES.PAUSED,
    MESSAGE_STATES.CANCELLED
  ],
  [MESSAGE_STATES.SENT]: [], // Estado final
  [MESSAGE_STATES.PAUSED]: [
    MESSAGE_STATES.SCHEDULED, 
    MESSAGE_STATES.CANCELLED,
    MESSAGE_STATES.DRAFT
  ],
  [MESSAGE_STATES.CANCELLED]: [MESSAGE_STATES.DRAFT], // Permitir recrear
  [MESSAGE_STATES.FAILED]: [
    MESSAGE_STATES.RETRY, 
    MESSAGE_STATES.DRAFT,
    MESSAGE_STATES.CANCELLED
  ],
  [MESSAGE_STATES.RETRY]: [
    MESSAGE_STATES.SENT, 
    MESSAGE_STATES.FAILED, 
    MESSAGE_STATES.PAUSED,
    MESSAGE_STATES.CANCELLED
  ]
};

// Utilidades para manejar estados
export const getStateConfig = (state) => {
  return MESSAGE_STATE_CONFIG[state] || MESSAGE_STATE_CONFIG[MESSAGE_STATES.DRAFT];
};

export const canTransitionTo = (currentState, targetState) => {
  const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
  return allowedTransitions.includes(targetState);
};

export const getAvailableActions = (state) => {
  const config = getStateConfig(state);
  const actions = [];

  if (config.canEdit) actions.push('edit');
  if (config.canDelete) actions.push('delete');
  if (config.canDuplicate) actions.push('duplicate');
  if (config.canSchedule) actions.push('schedule');
  if (config.canPause) actions.push('pause');
  if (config.canResume) actions.push('resume');
  if (config.canCancel) actions.push('cancel');
  if (config.canRetry) actions.push('retry');
  if (config.canViewStats) actions.push('viewStats');
  if (config.canViewError) actions.push('viewError');

  return actions;
};

export const getStateStats = (messages) => {
  const stats = {};
  
  Object.keys(MESSAGE_STATES).forEach(stateKey => {
    const state = MESSAGE_STATES[stateKey];
    stats[state] = messages.filter(msg => msg.status === state).length;
  });

  return stats;
};

// Validadores de estado
export const isActiveState = (state) => {
  return [MESSAGE_STATES.SCHEDULED, MESSAGE_STATES.SENDING, MESSAGE_STATES.RETRY].includes(state);
};

export const isCompletedState = (state) => {
  return [MESSAGE_STATES.SENT, MESSAGE_STATES.CANCELLED].includes(state);
};

export const isErrorState = (state) => {
  return [MESSAGE_STATES.FAILED].includes(state);
};

export const isPausedState = (state) => {
  return [MESSAGE_STATES.PAUSED].includes(state);
};

export const isEditableState = (state) => {
  const config = getStateConfig(state);
  return config.canEdit;
};
