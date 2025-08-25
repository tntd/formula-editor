import React from 'react';
import './ErrorPanel.less';

const ErrorPanel = ({ errors = [], theme = 'day', visible = true }) => {
    if (!visible || errors.length === 0) {
        return null;
    }

    const getErrorIcon = (severity) => {
        return severity === 'error' ? '❌' : '⚠️';
    };

    const getErrorClass = (severity) => {
        return severity === 'error' ? 'error-item-error' : 'error-item-warning';
    };

    return (
        <div className={`error-panel error-panel-${theme}`}>
            <div className="error-panel-header">
                <span className="error-panel-title">
                    代码检测结果 ({errors.length}个问题)
                </span>
            </div>
            <div className="error-panel-content">
                {errors.map((error, index) => (
                    <div 
                        key={index} 
                        className={`error-item ${getErrorClass(error.severity)}`}
                        title={`第${error.line}行: ${error.message}`}
                    >
                        <span className="error-icon">
                            {getErrorIcon(error.severity)}
                        </span>
                        <span className="error-line">
                            第{error.line}行
                        </span>
                        <span className="error-message">
                            {error.message}
                        </span>
                        {error.text && (
                            <span className="error-text">
                                "{error.text}"
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ErrorPanel;