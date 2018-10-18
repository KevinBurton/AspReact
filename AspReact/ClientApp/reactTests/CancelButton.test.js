import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { CancelButton } from '../ClientApp/components/CancelButton';

describe('A suite', function() {
  it('should render without throwing an error', function() {
    expect(shallow(<CancelButton />).contains(<button className="btn btn-default"></button>)).toBe(true);
  });

  it('should be selectable by class "foo"', function() {
    expect(shallow(<CancelButton />).contains(<button className="btn btn-default"></button>).toBe(true);
    expect(shallow(<CancelButton />).is('.btn')).toBe(true);
  });

  it('should mount in a full DOM', function() {
    expect(mount(<CancelButton />).find('.btn').length).toBe(1);
  });
});
